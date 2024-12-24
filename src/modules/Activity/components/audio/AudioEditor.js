import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getActivityAudio, updateAudioContent, generateActivityAudio, generateActivityScript, regenerateActivityScript, updateDocumentContent, getVoiceOptions } from '../../services/activityService';
import LoadingSpinner from '../../../Shared/components/LoadingSpinner';
import Button2 from '../../../Shared/components/Button2';
import Select from 'react-select';
import styles from './AudioEditor.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const AudioEditor = ({ courseId, activityId, handleError }) => {
    const { t } = useTranslation();
    const [activityData, setActivityData] = useState(null);
    const [activityAudio, setActivityAudio] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('settings');
    const [editableScript, setEditableScript] = useState('');
    const [instructions, setInstructions] = useState(''); // State for instructions
    const [selectedVoice, setSelectedVoice] = useState(null); // State for selected voice
    const [menuIsOpen, setMenuIsOpen] = useState(false); // State for menu open
    const [voiceOptions, setVoiceOptions] = useState([]); // State for voice options
    const [stability, setStability] = useState(50); // State for stability level
    const [similarity, setSimilarity] = useState(50); // State for similarity level

    useEffect(() => {
        const fetchActivity = async () => {
            setLoading(true);
            try {
                const response = await getActivityAudio(activityId);
                setActivityData(response.data.activity);
                if (response.data.audio) {
                    setActivityAudio(response.data.audio);
                    // console.log(response.data.audio.content)
                    // console.log(response.data.audio.content)
                    setEditableScript(response.data.audio.content);
                }
            } catch (error) {
                console.error('Error fetching activity:', error);
                handleError(t('errorFetchingActivity'));
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, [activityId]);

    useEffect(() => {
        const fetchVoiceOptions = async () => {
            try {
                const response = await getVoiceOptions();
                const options = response.data.voices.map(voice => ({
                    value: voice.voice_id,
                    label: (
                        <div className={styles.voiceOption}>
                            <span>{voice.name}</span>
                            {menuIsOpen && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        new Audio(voice.preview_url).play();
                                    }}
                                    className={styles.playButton}
                                >
                                    <FontAwesomeIcon icon={faPlay} />
                                </button>
                            )}
                        </div>
                    ),
                    name: voice.name
                }));
                setVoiceOptions(options);
            } catch (error) {
                console.error('Error fetching voice options:', error);
                handleError(t('errorFetchingVoiceOptions'));
            }
        };
        fetchVoiceOptions();
    }, [menuIsOpen, handleError, t]);

    const handleGenerateScript = async () => {
        setLoading(true);
        try {
            const data = {
                Prompt: instructions,
                // Duration: activityData.duration,
                // DocumentType: activityData.contentType,
                ActivityId: activityId,
                // VoiceId: selectedVoice ? selectedVoice.voice_id : null,
                // Stability: stability,
                // Similarity: similarity
            };
            const response = await generateActivityScript(data);
            setActivityAudio(response.data);
            setEditableScript(response.data.contentGenerated);
            console.log('Script generated');
            setActiveTab('script');
        } catch (error) {
            console.error('Error generating script:', error);
            handleError(t('errorGeneratingactivityAudio')); // Use translation for error message
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
                // VoiceId: selectedVoice ? selectedVoice.voice_id : null,
                // Stability: stability,
                // Similarity: similarity
            };
            const response = await regenerateActivityScript(data);
            // setActivityAudio(response.data);
            setEditableScript(response.data.contentGenerated);
            console.log('Script regenerated');
            setActiveTab('script');
        } catch (error) {
            console.error('Error regenerating script:', error);
            handleError(t('errorGeneratingactivityAudio')); // Use translation for error message
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
            await updateAudioContent(activityAudio.id, data);
            console.log('Script content updated');
            // setActiveTab('settings');
        } catch (error) {
            console.error('Error updating script content:', error);
            handleError(t('errorUpdatingDocumentContent')); // Use translation for error message
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAudio = async () => {
        setLoading(true);
        try {
            const data = {
                ActivityId: activityId,
                VoiceId: selectedVoice ? selectedVoice.value : null,
                // Stability: stability,
                // Similarity: similarity
            };
            // console.log(selectedVoice.value)
            const response = await generateActivityAudio(data);
            activityAudio.rawAudio = response.data.content;
            setActivityAudio(activityAudio);
            setActiveTab('script');
        } catch (error) {
            console.error('Error generating audio:', error);
            handleError(t('errorGeneratingAudio')); // Use translation for error message
        } finally {
            setLoading(false);
        }
    };

    const updateSliderBackground = (value) => {
        return `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${value}%, #ddd ${value}%, #ddd 100%)`;
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

    const filterOption = (candidate, input) => {
        return candidate.data.__isNew__ || candidate.data.name.toLowerCase().includes(input.toLowerCase());
    };

    return (
        <div className={styles.audioEditor}>
            <div className={styles.tabs}>
                <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? styles.active : ''}>
                    {t('settings')}
                </button>
                <button onClick={() => setActiveTab('script')} className={activeTab === 'script' ? styles.active : ''}>
                    {t('script')}
                </button>
                <button onClick={() => setActiveTab('audio')} className={activeTab === 'audio' ? styles.active : ''}>
                    {t('audio')}
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
                            { activityAudio ? (
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
                    {activityAudio ? (
                    <>
                        <textarea
                            className={styles.scriptViewer}
                            value={editableScript}
                            onChange={(e) => setEditableScript(e.target.value)}
                        />
                        <Button2 className={styles.saveButton} onClick={handleSaveScript}>
                            {t('save')}
                        </Button2>
                        <div className={styles.voiceSettingsContainer}>
                            <div className={styles.voicesContainer}>
                                <strong>{t('voices')}</strong>
                                <Select
                                    options={voiceOptions}
                                    onChange={setSelectedVoice}
                                    placeholder={t('searchVoices')}
                                    className={styles.voiceSelect}
                                    onMenuOpen={() => setMenuIsOpen(true)}
                                    onMenuClose={() => setMenuIsOpen(false)}
                                    filterOption={filterOption}
                                    styles={customStyles}
                                />
                            </div>
                            <div className={styles.sliderContainer}>
                                <label>{t('stability')}</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={stability}
                                    onChange={(e) => setStability(e.target.value)}
                                    className={styles.slider}
                                    style={{ background: updateSliderBackground(stability) }}
                                />
                                <span>{stability}%</span>
                            </div>
                            <div className={styles.sliderContainer}>
                                <label>{t('similarity')}</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={similarity}
                                    onChange={(e) => setSimilarity(e.target.value)}
                                    className={styles.slider}
                                    style={{ background: updateSliderBackground(similarity) }}
                                />
                                <span>{similarity}%</span>
                            </div>
                            <Button2 className={styles.generateActivityButton} onClick={handleGenerateAudio}>
                                {t('generateAudio')}
                            </Button2>
                        </div>
                    </>
                ) : (
                    <p>{t('scriptNotGenerated')}</p>
                )}
                </div>
            )}
            {activeTab === 'audio' && (
                <div className={styles.audioContainer}>
                    {activityAudio && activityAudio.rawAudio ? (
                        <audio controls className={styles.audioPlayer}>
                            <source src={`data:audio/mp3;base64,${activityAudio.rawAudio}`} type="audio/mp3" />
                            Your browser does not support the audio element.
                        </audio>
                    ) : (
                        <p>{t('audioContent')}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AudioEditor;
