import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getActivityVideo, updateVideoContent, generateVideoScript, regenerateVideoScript } from '../../services/activityService';
import LoadingSpinner from '../../../Shared/components/LoadingSpinner';
import Button2 from '../../../Shared/components/Button2';
import Select from 'react-select';
import styles from './VideoEditor.module.css';
import AvatarVideoConfig from './AvatarVideoConfig'; // Importing AvatarVideoConfig component
import SceneVideoConfig from './SceneVideoConfig'; // Importing SceneVideoConfig component

const VideoEditor = ({ courseId, activityId, handleError }) => {
    const { t } = useTranslation();
    const [activityData, setActivityData] = useState(null);
    const [activityVideo, setActivityVideo] = useState(null);
    const [fileToken, setFileToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('settings');
    const [editableScript, setEditableScript] = useState('');
    const [instructions, setInstructions] = useState(''); // State for instructions
    const [videoType, setVideoType] = useState('avatar'); // State to manage video type
    const [videoLoading, setVideoLoading] = useState(false); // State for video loading

    const fetchActivity = async () => {
        setLoading(true);
        try {
            const response = await getActivityVideo(activityId);
            setActivityData(response.data.activity);
            if (response.data.video) {
                setActivityVideo(response.data.video);
                setEditableScript(response.data.video.content);
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

    const handleGenerateScript = async () => {
        setLoading(true);
        try {
            const data = {
                Prompt: instructions,
                ActivityId: activityId,
            };
            const response = await generateVideoScript(data);
            fetchActivity();
            setActiveTab('script');
        } catch (error) {
            console.error('Error generating script:', error);
            handleError(t('errorGeneratingActivityScript')); // Use translation for error message
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerateScript = async () => {
        setLoading(true);
        try {
            const data = {
                Prompt: instructions,
                ActivityId: activityId,
            };
            const response = await regenerateVideoScript(data);
            setEditableScript(response.data.contentGenerated);
            console.log('Script regenerated');
            setActiveTab('script');
        } catch (error) {
            console.error('Error regenerating script:', error);
            handleError(t('errorGeneratingActivityScript')); // Use translation for error message
        } finally {
            setLoading(false);
        }
    };

    const handleSaveScript = async () => {
        setLoading(true);
        try {
            const data = {
                content: editableScript,
            };
            await updateVideoContent(activityVideo.id, data);
            console.log('Script content updated');
        } catch (error) {
            console.error('Error updating script content:', error);
            handleError(t('errorUpdatingDocumentContent')); // Use translation for error message
        } finally {
            setLoading(false);
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
        <div className={styles.videoEditor}>
            <div className={styles.tabs}>
                <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? styles.active : ''}>
                    {t('settings')}
                </button>
                <button onClick={() => setActiveTab('script')} className={activeTab === 'script' ? styles.active : ''}>
                    {t('script')}
                </button>
                <button onClick={() => setActiveTab('video')} className={activeTab === 'video' ? styles.active : ''}>
                    {t('video')}
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
                            <div className={styles.instructionsContainer}>
                                <textarea
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder={t('enterInstructions')}
                                    className={styles.instructionsTextarea}
                                />
                            </div>
                            { activityVideo ? (
                                <Button2 className={styles.generateActivityButton} onClick={handleRegenerateScript}>
                                    {t('regenerateScript')}
                                </Button2> ) : (
                                <Button2 className={styles.generateActivityButton} onClick={handleGenerateScript}>
                                    {t('generateScript')}
                                </Button2>
                            )}
                        </>
                    ) : null}
                </div>
            )}
            {activeTab === 'script' && (
                <div className={styles.scriptContainer}>
                    {activityVideo ? (
                    <>
                        <textarea
                            className={styles.scriptViewer}
                            value={editableScript}
                            onChange={(e) => setEditableScript(e.target.value)}
                        />
                        <Button2 className={styles.saveButton} onClick={handleSaveScript}>
                            {t('save')}
                        </Button2>
                        <div className={styles.videoTypeContainer}>
                            <strong>{t('videoType')}</strong>
                            <Select
                                options={[
                                    { value: 'avatar', label: t('videoWithAvatar') },
                                    { value: 'scene', label: t('videoWithScenes') },
                                ]}
                                className={styles.videoTypeSelect}
                                onChange={(option) => setVideoType(option.value)}
                                value={{ value: videoType, label: videoType === 'avatar' ? t('videoWithAvatar') : t('videoWithScenes') }}
                                styles={customStyles}
                            />
                        </div>
                        {videoType === 'avatar' && (
                            <AvatarVideoConfig
                                setLoading={setLoading}
                                handleError={handleError}
                                activityId={activityId}
                                activityVideo={activityVideo}
                                setActivityVideo={setActivityVideo}
                                setActiveTab={setActiveTab}
                                setVideoLoading={setVideoLoading}
                            />
                        )}
                        {videoType === 'scene' && (
                            <SceneVideoConfig
                                setLoading={setLoading}
                                handleError={handleError}
                                activityId={activityId}
                                activityVideo={activityVideo}
                                setActivityVideo={setActivityVideo}
                                setActiveTab={setActiveTab}
                                setVideoLoading={setVideoLoading}
                            />
                        )}
                    </>
                ) : (
                    <p>{t('scriptNotGenerated')}</p>
                )}
                </div>
            )}
            {activeTab === 'video' && (
                <div className={styles.videoContainer}>
                    {videoLoading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingBackground}></div>
                            <LoadingSpinner />
                        </div>
                    ) : (
                        activityVideo && activityVideo.videoUrl ? (
                            <video controls className={styles.videoPlayer}>
                                <source src={`${process.env.NEXT_PUBLIC_API_URL}/v1/download/video/file/${activityData.id}?token=${fileToken}`} type="video/mp4" />
                                Your browser does not support the video element.
                            </video>
                        ) : (
                            <p>{t('videoNotGenerated')}</p>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default VideoEditor;
