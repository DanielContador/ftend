import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { getVideogenVideoVoiceOptions, 
    generateVideogenActivityVideo, 
    retrieveVideogenActivityVideoStatus } from '../../services/activityService';
import Button2 from '../../../Shared/components/Button2';
import styles from './SceneVideoConfig.module.css'; // Importing styles

const SceneVideoConfig = ({ setLoading, handleError, activityId, activityVideo, setActivityVideo, setActiveTab, setVideoLoading }) => {
    const { t } = useTranslation(); // Using the translation hook
    const [selectedVoice, setSelectedVoice] = useState(null); // State for selected voice
    const [menuIsOpen, setMenuIsOpen] = useState(false); // State for menu open
    const [voiceOptions, setVoiceOptions] = useState([]); // State for voice options

    useEffect(() => {
        const fetchVoiceOptions = async () => {
            try {
                const response = await getVideogenVideoVoiceOptions();
                const spanishVoices = response.data.voices.filter(voice => voice.language === 'Spanish');
                const options = spanishVoices.map(voice => ({
                    value: voice.name,
                    character: voice.name,
                    label: (
                        <div className={styles.voiceOption}>
                            <span>{voice.name}</span>
                            {menuIsOpen && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        new Audio(voice.audioSample).play();
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

    const handleGenerateVideo = async () => {
        setLoading(true);
        try {
            const data = {
                ActivityId: activityId,
                Voice: selectedVoice ? selectedVoice.value : null,
                Subtitles: true,
                CaptionFontName: "Verdana",
                BackgroundMusic: true
            };
            const response = await generateVideogenActivityVideo(data);
            activityVideo.videoUrl = response.data.content;
            setActivityVideo(activityVideo);
            setActiveTab('video');
            setVideoLoading(true);
            pollVideoStatus();
        } catch (error) {
            console.error('Error generating video:', error);
            handleError(t('errorGeneratingVideo')); // Use translation for error message
        } finally {
            setLoading(false);
        }
    };

    const pollVideoStatus = async () => {
        const interval = setInterval(async () => {
            try {
                const response = await retrieveVideogenActivityVideoStatus(activityId);
                if (response.data.content?.status === 'ready') {
                    clearInterval(interval);
                    setActivityVideo(prev => ({ ...prev, rawVideo: response.data.url }));
                    setVideoLoading(false);
                } else if (response.data.content.status !== 'rendering') {
                    clearInterval(interval);
                    setVideoLoading(false);
                    handleError(t('errorGeneratingVideo'));
                }
            } catch (error) {
                clearInterval(interval);
                setVideoLoading(false);
                console.error('Error polling video status:', error);
                handleError(t('errorGeneratingVideo'));
            }
        }, 5000); // Poll every 5 seconds
    };

    const customStyles = {
        control: (styles) => ({ 
            ...styles, 
            'button': {
                display: 'none'
            }
        }),
    };

    const filterOption = (candidate, input) => {
        return candidate.data.__isNew__ || candidate.data.character.toLowerCase().includes(input.toLowerCase());
    };

    return (
        <>
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
        </div>
        <Button2 className={styles.generateActivityButton} onClick={handleGenerateVideo}>
            {t('generateVideo')}
        </Button2>
        </>
    );
};

export default SceneVideoConfig;
