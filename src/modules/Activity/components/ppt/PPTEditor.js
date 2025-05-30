import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getActivityPPT, generateActivityPPT, getPPTTemplates, retrieveActivityPPTStatus, editPPTContent } from '../../services/activityService';
import LoadingSpinner from '../../../../shared/components/LoadingSpinner';
import Button2 from '../../../../shared/components/Button2';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import styles from './PPTEditor.module.css';

const PPTEditor = ({ courseId, activityId, handleError }) => {
    const { t } = useTranslation();
    const [activityData, setActivityData] = useState(null);
    const [activityPPT, setActivityPPT] = useState(null);
    const [fileToken, setFileToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('settings');
    const [instructions, setInstructions] = useState(''); // State for instructions
    const [numSlides, setNumSlides] = useState(10); // State for number of slides
    const [templates, setTemplates] = useState([]); // State for templates
    const [selectedTemplate, setSelectedTemplate] = useState(null); // State for selected template
    const [pptLoading, setPPTLoading] = useState(false); // State for PPT loading
    const [replacements, setReplacements] = useState([{ shape_name: '', content: '' }]); // State for replacements

    const fetchActivity = async () => {
        setLoading(true);
        try {
            const response = await getActivityPPT(activityId);
            setActivityData(response.data.activity);
            if (response.data.powerPoint) {
                setActivityPPT(response.data.powerPoint);
            }
            if(response.data.token) {
                setFileToken(response.data.token);
            }
        } catch (error) {
            console.error('Error fetching activity:', error);
            handleError(t('errorFetchingActivity'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, [activityId]);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await getPPTTemplates();
                const options = response.data.result.map(template => ({
                    value: template.name,
                    label: (
                        <div className={styles.templateOption}>
                            <img src={template.images.cover} alt={template.name} className={styles.templateImage} />
                            <span>{template.name}</span>
                        </div>
                    ),
                    name: template.name
                }));
                setTemplates(options);
            } catch (error) {
                console.error('Error fetching templates:', error);
                handleError(t('errorFetchingTemplates'));
            }
        };
        fetchTemplates();
    }, [handleError, t]);

    const handleGeneratePPT = async () => {
        setLoading(true);
        try {
            const data = {
                activityId: activityId,
                prompt_instructions: instructions,
                tone: 'educational',
                verbosity: "standard",
                fetch_images: true,
                amount_slides: numSlides,
                Template: selectedTemplate ? selectedTemplate.value : 'default',
                amount_slides: numSlides,
            };
            const response = await generateActivityPPT(data);
            setActivityPPT(response.data);
            setActiveTab('ppt');
            setPPTLoading(true);
            pollPPTStatus();
        } catch (error) {
            console.error('Error generating PPT:', error);
            handleError(t('errorGeneratingPPT')); // Use translation for error message
        } finally {
            setLoading(false);
        }
    };

    const pollPPTStatus = async () => {
        const interval = setInterval(async () => {
            try {
                const response = await retrieveActivityPPTStatus(activityId);
                if (response.data.content?.status === 'ready') {
                    clearInterval(interval);
                    setActivityPPT(prev => ({ ...prev, pptUrl: response.data.url }));
                    setPPTLoading(false);
                    fetchActivity();
                } else if (response.data.content?.status === 'error') {
                    clearInterval(interval);
                    setPPTLoading(false);
                    handleError(t('errorGeneratingPPT'));
                }
            } catch (error) {
                clearInterval(interval);
                setPPTLoading(false);
                console.error('Error polling PPT status:', error);
                handleError(t('errorGeneratingPPT'));
            }
        }, 5000); // Poll every 5 seconds
    };

    const handleAddReplacement = () => {
        setReplacements([...replacements, { shape_name: '', content: '' }]);
    };

    const handleRemoveReplacement = (index) => {
        const newReplacements = replacements.filter((_, i) => i !== index);
        setReplacements(newReplacements);
    };

    const handleReplacementChange = (index, field, value) => {
        const newReplacements = [...replacements];
        newReplacements[index][field] = value;
        setReplacements(newReplacements);
    };

    const handleReplaceText = async () => {
        setPPTLoading(true);
        try {
            const data = {
                activityId: activityId,
                replacements: replacements,
            };
            await editPPTContent(data);
            fetchActivity();
        } catch (error) {
            console.error('Error replacing text:', error);
            handleError(t('errorReplacingText')); // Use translation for error message
        } finally {
            setPPTLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />; // Render loading spinner while loading

    const contentOverview = activityData ? JSON.parse(activityData.contentOverview) : [];

    const customStyles = {
        control: (styles) => ({ 
            ...styles, 
            'button': {
                display: 'none'
            }
        }),
    };

    return (
        <div className={styles.pptEditor}>
            <div className={styles.tabs}>
                <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? styles.active : ''}>
                    {t('settings')}
                </button>
                <button onClick={() => setActiveTab('ppt')} className={activeTab === 'ppt' ? styles.active : ''}>
                    {t('ppt')}
                </button>
            </div>
            {activeTab === 'settings' && (
                <div className={styles.form}>
                    {activityData ? (
                        <>
                            <div className={styles.activityDetails}>
                                <p><strong>{t('duration')}</strong> {activityData.duration} {t('minutes')}</p>
                                <p><strong>{t('format')}</strong> {activityData.contentType}</p>
                            </div>
                            <div className={styles.summaryContainer}>
                                <h3>{t('activitySummary')}</h3>
                                <ul>
                                    {contentOverview.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.numSlidesContainer}>
                                <label>{t('numberOfSlides')}</label>
                                <input
                                    type="number"
                                    value={numSlides}
                                    onChange={(e) => setNumSlides(e.target.value)}
                                    className={styles.numSlidesInput}
                                    min="1"
                                />
                            </div>
                            <div className={styles.templateContainer}>
                                <label>{t('selectTemplate')}</label>
                                <Select
                                    options={templates}
                                    onChange={setSelectedTemplate}
                                    placeholder={t('selectTemplate')}
                                    className={styles.templateSelect}
                                    styles={customStyles}
                                />
                            </div>
                            <div className={styles.instructionsContainer}>
                                <textarea
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder={t('enterInstructions')}
                                    className={styles.instructionsTextarea}
                                />
                            </div>
                            <Button2 className={styles.generateActivityButton} onClick={handleGeneratePPT}>
                                {t('generatePPT')}
                            </Button2>
                        </>
                    ) : null}
                </div>
            )}
            {activeTab === 'ppt' && (
                <div className={styles.pptContainer}>
                    {pptLoading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingBackground}></div>
                            <LoadingSpinner />
                        </div>
                    ) : (
                        activityPPT ? (
                            <>
                            <div className={styles.pptViewer}>
                                <iframe
                                    src={`https://view.officeapps.live.com/op/view.aspx?src=${process.env.NEXT_PUBLIC_API_URL}/v1/download/ppt/file/${activityData.id}?token=${fileToken}`}
                                    title="PPT Viewer"
                                    className={styles.pptIframe}
                                />
                            </div>
                            <div className={styles.replacementsContainer}>
                                <h3>{t('replaceText')}</h3>
                                {replacements.map((replacement, index) => (
                                    <div key={index} className={styles.replacementRow}>
                                        <input
                                            type="text"
                                            placeholder={t('shapeName')}
                                            value={replacement.shape_name}
                                            onChange={(e) => handleReplacementChange(index, 'shape_name', e.target.value)}
                                            className={styles.replacementInput}
                                        />
                                        <input
                                            type="text"
                                            placeholder={t('content')}
                                            value={replacement.content}
                                            onChange={(e) => handleReplacementChange(index, 'content', e.target.value)}
                                            className={styles.replacementInput}
                                        />
                                        <button
                                            className={styles.removeReplacementButton}
                                            onClick={() => handleRemoveReplacement(index)}
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                    </div>
                                ))}
                                <button className={styles.addReplacementButton} onClick={handleAddReplacement}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                                <Button2 className={styles.replaceButton} onClick={handleReplaceText}>
                                    {t('replace')}
                                </Button2>
                            </div>
                            </>
                        ) : (
                            <p>{t('pptNotGenerated')}</p>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default PPTEditor;
