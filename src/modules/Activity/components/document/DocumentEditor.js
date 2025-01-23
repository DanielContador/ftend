import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import styles from './DocumentEditor.module.css'; // Importing styles
import { useTranslation } from 'react-i18next'; // Importing useTranslation
import Button2 from '../../../Shared/components/Button2';
import LoadingSpinner from '../../../Shared/components/LoadingSpinner';
import { getActivityDocument, generateActivityDocument, regenerateActivityDocument, updateDocumentContent } from '../../services/activityService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import Switch from 'react-switch'; // Importing Switch component
import UploadDocumentPopup from '../../../Shared/components/UploadDocumentPopup'; // Importing UploadDocumentPopup

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
    const [includeImages, setIncludeImages] = useState(true); // State for IncludeImages
    const [showImagePopup, setShowImagePopup] = useState(false); // State for image popup
    const [selectedImage, setSelectedImage] = useState(null); // State for selected image
    const contentRef = useRef(null);

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
    
    useEffect(() => {
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
                IncludeImages: includeImages,
            };
            const response = await generateActivityDocument(data);
            fetchActivity();
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
                content: `${editableContent}`,
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

    const handleImageClick = (e) => {
        if (e.target.tagName === 'IMG') {
            setSelectedImage(e.target);
            setShowImagePopup(true);
        }
    };

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            selectedImage.src = event.target.result;
            setEditableContent(contentRef.current.innerHTML); // Update editableContent with the new image
            setShowImagePopup(false);
        };
        reader.readAsDataURL(file);
    };

    if (loading) return <LoadingSpinner />; // Render loading spinner while loading

    const contentOverview = activityData ? JSON.parse(activityData.contentOverview) : [];

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
                            <div className={styles.switchContainer}>
                                <label>{t('includeImages')}</label>
                                <Switch
                                    onChange={setIncludeImages}
                                    checked={includeImages}
                                    onColor="#86d3ff"
                                    onHandleColor="#2693e6"
                                    handleDiameter={20}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                    height={15}
                                    width={35}
                                    className="react-switch"
                                />
                            </div>
                        </>
                    ) : null}
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
                    {activityDocument ? (
                        <>
                            <div
                                className={styles.documentViewer}
                                onBlur={t => setEditableContent(t.currentTarget.innerHTML)}
                                contentEditable
                                ref={contentRef}
                                onClick={handleImageClick}
                                dangerouslySetInnerHTML={{ __html: editableContent }}
                                style={{ whiteSpace: 'pre-wrap' }}
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
            <UploadDocumentPopup
                isOpen={showImagePopup}
                onClose={() => setShowImagePopup(false)}
                onUpload={handleImageUpload}
                title={t('uploadImage')}
                message={t('selectImageToUpload')}
            />
        </div>
    );
};

export default DocumentEditor;
