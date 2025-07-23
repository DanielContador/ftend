import React, { useEffect, useState } from "react";
import styles from "./ActivityGenerationVideoGuionTab.module.css";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  getElaiVideoVoiceOptions,
  getVideogenVideoVoiceOptions,
} from "../../../services/activityService";
import AvatarSelectionTab from "./AvatarSelectionTab";

const videoTypeOptions = [
  { value: "avatar", label: "Video con avatar" },
  { value: "scene", label: "Video con escenas" },
];

const ActivityGenerationVideoGuionTab = ({
  guionInput,
  setGuionInput,
  guionEdit,
  setGuionEdit,
  setVideoType,
  videoType,
  avatarVoice,
  setAvatarVoice,
  t,
  showAvatarSelection,
  setShowAvatarSelection,
  onAvatarSelected,
  avatarsData,
  loadingAvatars,
  searchAvatar,
  setSearchAvatar,
  selectedAvatar,
  handleSaveScript, // <-- nuevo prop
  isScriptGenerated,
}) => {
  const [voiceOptions, setVoiceOptions] = useState([]);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [tempGuion, setTempGuion] = useState(guionInput);
  const [lastLoadedType, setLastLoadedType] = useState(null);

  // Fetch voices when videoType changes or on first mount
  useEffect(() => {
    // Only fetch if videoType changed or first mount
    if (lastLoadedType !== videoType) {
      setAvatarVoice(null); // Reset avatarVoice when videoType changes
      setLastLoadedType(videoType);

      const fetchAvatarVoices = async () => {
        setLoadingVoices(true);
        try {
          const response = await getElaiVideoVoiceOptions();
          const spanishVoices = response.data.find(
            (language) => language.name === "Spanish"
          );
          const options = [];
          if (spanishVoices) {
            ["male", "female"].forEach((gender) => {
              spanishVoices[gender].forEach((voice) => {
                options.push({
                  value: voice.voice,
                  character: voice.character,
                  voiceProvider: voice.voiceProvider,
                  label: voice.character,
                  name: voice.name,
                });
              });
            });
          }
          setVoiceOptions(options);
        } catch (error) {
          setVoiceOptions([]);
        } finally {
          setLoadingVoices(false);
        }
      };

      const fetchSceneVoices = async () => {
        setLoadingVoices(true);
        try {
          const response = await getVideogenVideoVoiceOptions();
          const spanishVoices = response.data.voices.filter(
            (voice) => voice.language === "Spanish"
          );
          const options = spanishVoices.map((voice) => ({
            value: voice.name,
            character: voice.name,
            label: voice.name,
            name: voice.name,
          }));
          setVoiceOptions(options);
        } catch (error) {
          setVoiceOptions([]);
        } finally {
          setLoadingVoices(false);
        }
      };

      if (videoType === "avatar") {
        fetchAvatarVoices();
      } else if (videoType === "scene") {
        fetchSceneVoices();
      } else {
        setVoiceOptions([]);
      }
    }
    // eslint-disable-next-line
  }, [videoType, setAvatarVoice, lastLoadedType]);

  // Handler to change video type and reset avatarVoice
  const handleVideoTypeChange = (option) => {
    setVideoType(option.value);
    setAvatarVoice(null);
    setLastLoadedType(null); // Force reload voices on next effect
    if (option.value === "avatar") {
      setShowAvatarSelection(false);
    }
  };

  // Handle edit/accept/cancel for guion
  const handleEditClick = () => {
    setTempGuion(guionInput);
    setGuionEdit(true);
  };
  const handleCancelEdit = () => {
    setTempGuion(guionInput);
    setGuionEdit(false);
  };
  const handleSaveEdit = () => {
    setGuionInput(tempGuion);
    setGuionEdit(false);
    if (typeof handleSaveScript === "function") {
      handleSaveScript(tempGuion);
    }
  };

  // Mostrar el tab de selección de avatar si corresponde
  if (showAvatarSelection && videoType === "avatar") {
    return (
      <AvatarSelectionTab
        avatarsData={avatarsData}
        loadingAvatars={loadingAvatars}
        searchAvatar={searchAvatar}
        setSearchAvatar={setSearchAvatar}
        onAvatarSelected={onAvatarSelected}
        selectedAvatar={selectedAvatar} // <-- pasar el prop
      />
    );
  }

  return (
    <div className={styles.guionTabWrapper}>
      <div className={styles.guionCard}>
        <div className={styles.guionCardHeader}>Guión del video</div>
        <div className={styles.guionCardBody}>
          {guionEdit ? (
            <textarea
              className={styles.guionTextarea}
              value={tempGuion}
              onChange={(e) => setTempGuion(e.target.value)}
              style={{
                height: 200,
                minHeight: 200,
                maxHeight: 200,
                overflowY: "auto",
              }}
            />
          ) : (
            <div
              className={styles.guionTextDisplay}
              style={{
                height: 200,
                minHeight: 200,
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {guionInput}
            </div>
          )}
        </div>
        {!guionEdit ? (
          <button
            className={styles.editGuionBtn}
            onClick={handleEditClick}
            type="button"
            disabled={!isScriptGenerated}
          >
            <FontAwesomeIcon icon={faPen} style={{ marginRight: 6 }} />
            {t("edit")}
          </button>
        ) : (
          <div className={styles.editGuionActions}>
            <button
              className={styles.saveGuionBtn}
              onClick={handleSaveEdit}
              type="button"
            >
              <FontAwesomeIcon icon={faSave} style={{ marginRight: 4 }} />
              {t("save")}
            </button>
            <button
              className={styles.cancelGuionBtn}
              onClick={handleCancelEdit}
              type="button"
            >
              <FontAwesomeIcon icon={faXmark} style={{ marginRight: 4 }} />
              Cancelar
            </button>
          </div>
        )}
      </div>
      <div className={styles.componentsCard}>
        <div className={styles.componentsCardHeader}>Componentes del video</div>
        <div className={styles.componentsCardBody}>
          <div className={styles.componentCol}>
            <label className={styles.componentLabel}>Tipo de Video</label>
            <Select
              options={videoTypeOptions.map((opt) => ({
                ...opt,
                label: t(
                  opt.value === "avatar" ? "videoWithAvatar" : "videoWithScenes"
                ),
              }))}
              classNamePrefix="videoTypeSelect"
              className={styles.videoTypeSelect__control}
              onChange={handleVideoTypeChange}
              value={videoTypeOptions
                .map((opt) => ({
                  ...opt,
                  label: t(
                    opt.value === "avatar"
                      ? "videoWithAvatar"
                      : "videoWithScenes"
                  ),
                }))
                .find((opt) => opt.value === videoType)}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 99999 }),
              }}
            />
          </div>
          <div className={styles.componentCol}>
            <label className={styles.componentLabel}>Voz</label>
            <Select
              options={voiceOptions}
              classNamePrefix="avatarVoiceSelect"
              className={styles.avatarVoiceSelect__control}
              onChange={
                (option) => setAvatarVoice(option ? option : null) // Guarda el objeto completo
              }
              value={
                avatarVoice
                  ? voiceOptions.find((opt) => opt.value === avatarVoice.value)
                  : null
              }
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 99999 }),
              }}
              isLoading={loadingVoices}
              placeholder={t("Voz del avatar") || "Seleccionar"}
              isDisabled={voiceOptions.length === 0}
              isClearable
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityGenerationVideoGuionTab;
