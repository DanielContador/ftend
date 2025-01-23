import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { getElaiVideoVoiceOptions, 
    getElaiVideoAvatarOptions, 
    generateElaiActivityVideo, 
    retrieveElaiActivityVideoStatus } from '../../services/activityService';
import Button2 from '../../../Shared/components/Button2';
import AvatarList from './AvatarList';
import styles from './AvatarVideoConfig.module.css'; // Importing styles

const AvatarVideoConfig = ({ setLoading, handleError, activityId, activityVideo, setActivityVideo, setActiveTab, setVideoLoading }) => {
    const { t } = useTranslation(); // Using the translation hook
    const [selectedVoice, setSelectedVoice] = useState(null); // State for selected voice
    const [menuIsOpen, setMenuIsOpen] = useState(false); // State for menu open
    const [voiceOptions, setVoiceOptions] = useState([]); // State for voice options
    const [avatars, setAvatars] = useState([]); // State for avatars
    const [selectedAvatar, setSelectedAvatar] = useState(null); // State for selected avatar
    const [selectedVariant, setSelectedVariant] = useState(null); // State for selected variant

    useEffect(() => {
        const fetchVoiceOptions = async () => {
            try {
                const response = await getElaiVideoVoiceOptions();
                const spanishVoices = response.data.find(language => language.name === 'Spanish');
                const options = [];
                if (spanishVoices) {
                    ['male', 'female'].forEach(gender => {
                        spanishVoices[gender].forEach(voice => {
                            options.push({
                                value: voice.voice,
                                character: voice.character,
                                voiceProvider: voice.voiceProvider,
                                label: (
                                    <div className={styles.voiceOption}>
                                        <span>{voice.character}</span>
                                        {menuIsOpen && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    new Audio(voice.url).play();
                                                }}
                                                className={styles.playButton}
                                            >
                                                <FontAwesomeIcon icon={faPlay} />
                                            </button>
                                        )}
                                    </div>
                                ),
                                name: voice.name
                            });
                        });
                    });
                }
                setVoiceOptions(options);
            } catch (error) {
                console.error('Error fetching voice options:', error);
                handleError(t('errorFetchingVoiceOptions'));
            }
        };
        fetchVoiceOptions();
    }, [menuIsOpen, handleError, t]);

    useEffect(() => {
        const fetchAvatarsOptions = async () => {
            try {
                const response = await getElaiVideoAvatarOptions();
                const filteredAvatars = response.data.filter(avatar => avatar.type === null && avatar.variants.length > 0);
                setAvatars(filteredAvatars);
            } catch (error) {
                console.error('Error fetching avatar options:', error);
                handleError(t('errorFetchingAvatarOptions'));
            }
        };
        fetchAvatarsOptions();
    }, [handleError, t]);

    const handleGenerateVideo = async () => {
        setLoading(true);
        try {
            const data = {
                ActivityId: activityId,
                Language: "Spanish", // Hardcoded for now
                Voice: selectedVoice ? selectedVoice.value : null,
                VoiceProvider: selectedVoice ? selectedVoice.voiceProvider : null,
                AvatarCode: selectedAvatar && selectedVariant ? `${selectedAvatar.code}.${selectedVariant.code}` : null,
                AvatarGender: selectedAvatar ? selectedAvatar.gender : null,
                AvatarCanvas: selectedVariant ? selectedVariant.canvas : null,
            };
            const response = await generateElaiActivityVideo(data);
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
                const response = await retrieveElaiActivityVideoStatus(activityId);
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

    const handleAvatarSelect = (avatar, variant) => {
        setSelectedAvatar(avatar);
        setSelectedVariant(variant);
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
        <AvatarList avatars={avatars} onAvatarSelect={handleAvatarSelect} />
        <Button2 className={styles.generateActivityButton} onClick={handleGenerateVideo}>
            {t('generateVideo')}
        </Button2>
        </>
    );
};

export default AvatarVideoConfig;
