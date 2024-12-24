import React, { useState, useEffect } from 'react';
import apiService from '../../../Shared/services/apiService'; // Adjust the import path as necessary
import { useRouter } from 'next/router'; // Import useRouter
import styles from './DocumentEditor.module.css'; // Importing styles
import { useTranslation } from 'react-i18next'; // Importing useTranslation
import Button2 from '../../../Shared/components/Button2';
import LoadingSpinner from '../../../Shared/components/LoadingSpinner';
import { getActivityDocument, generateActivityDocument, regenerateActivityDocument, updateDocumentContent } from '../../services/activityService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const DocumentEditor = ({ courseId, activityId, handleError }) => {
    const router = useRouter();
    const { t } = useTranslation(); // Using the translation hook
    const { id, format } = router.query; // Destructure id and type from query parameters
    const [activityData, setActivityData] = useState(null);
    const [activityDocument, setActivityDocument] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('settings'); // State to manage active tab
    const [instructions, setInstructions] = useState(''); // State for instructions
    const [editableContent, setEditableContent] = useState('');

    useEffect(() => {
        const fetchActivity = async () => {
            setLoading(true);
            try {
                const response = await getActivityDocument(activityId);
                setActivityData(response.data.activity);
                setActivityDocument(response.data.document);
                if (response.data.document) {
                    setEditableContent(response.data.document.content);
                }
                setActiveTab('settings')
            } catch (error) {
                console.error('Error fetching activity:', error);
                handleError(t('errorFetchingActivity'));
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, [activityId]);

    const handleGenerateActivity = async () => {
        setLoading(true);
        try {
            const data = {
                Prompt: instructions,
                Duration: activityData.duration,
                DocumentType: activityData.contentType,
                ActivityId: activityId,
            };
            const response = await generateActivityDocument(data);
            setActivityDocument(response.data);
            setEditableContent(response.data.content);
            console.log('Activity generated');
            setActiveTab('preview');
        } catch (error) {
            console.error('Error generating activity document:', error);
            handleError(t('errorGeneratingActivityDocument')); // Use translation for error message
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerateActivity = async () => {
        setLoading(true);
        try {
            const data = {
                Prompt: instructions,
                ActivityId: activityId,
            };
            const response = await regenerateActivityDocument(data);
            setActivityDocument(response.data);
            setEditableContent(response.data.content);
            console.log('Activity regenerated');
            setActiveTab('preview');
        } catch (error) {
            console.error('Error regenerating activity document:', error);
            handleError(t('errorGeneratingActivityDocument')); // Use translation for error message
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDocument = async () => {
        setLoading(true);
        try {
            const data = {
                content: editableContent,
            };
            await updateDocumentContent(activityDocument.id, data);
            console.log('Document content updated');
            setActiveTab('settings');
        } catch (error) {
            console.error('Error updating document content:', error);
            handleError(t('errorUpdatingDocumentContent')); // Use translation for error message
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />; // Render loading spinner while loading

    const contentOverview = activityData ? JSON.parse(activityData.contentOverview) : [];
    // console.log(activity.contentOverview)

    return (
        <div className={styles.documentEditor}>
            <div className={styles.tabs}>
                <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? styles.active : ''}>
                    {t('settings')}
                </button>
                <button onClick={() => setActiveTab('preview')} className={activeTab === 'preview' ? styles.active : ''}>
                    {t('document')}
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
                            </>
                        ) : null}
                    {/* Add form fields for editing activity here */}
                    <div className={styles.instructionsContainer}>
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder={t('enterInstructions')}
                            className={styles.instructionsTextarea}
                        />
                    </div>
                    { activityDocument ? (
                        <Button2 className={styles.generateActivityButton} onClick={handleRegenerateActivity}>
                            {t('regenerateActivity')}
                        </Button2> ) : (
                        <Button2 className={styles.generateActivityButton} onClick={handleGenerateActivity}>
                            {t('generateActivity')}
                        </Button2>
                    )}
                </div>
            )}
            {activeTab === 'preview' && (
                <div className={styles.previewContainer}>
                    {/* Render preview of the activity here */}
                    {activityDocument ? (
                        <>
                            <textarea
                                className={styles.documentViewer}
                                value={editableContent}
                                onChange={(e) => setEditableContent(e.target.value)}
                            />
                            <div className={styles.buttonRow}>
                                <a href={activityDocument.filePath} className={styles.downloadLink} download>
                                    <FontAwesomeIcon icon={faDownload} />
                                </a>
                                <Button2 className={styles.editButton} onClick={handleSaveDocument}>
                                    {t('save')}
                                </Button2>
                            </div>
                        </>
                    ) : (
                        <p>{t('documentNotGenerated')}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DocumentEditor;
