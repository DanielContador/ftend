import React, { useState, useEffect } from "react";
import styles from "./ActivityGenerationVideo.module.css";
import { useTranslation } from "react-i18next";
import {
  getActivityVideo,
  updateVideoContent,
  generateVideoScript,
  regenerateVideoScript,
  retrieveActivityVideoStatus,
  getElaiVideoAvatarOptions, // <-- Import for avatar list
  generateElaiActivityVideo,
  generateVideogenActivityVideo, // <-- importar
} from "../../../services/activityService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faWandSparkles,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import ActivityGenerationVideoConfigTab from "./ActivityGenerationVideoConfigTab";
import ActivityGenerationVideoGuionTab from "./ActivityGenerationVideoGuionTab";
import ActivityGenerationVideoVideoTab from "./ActivityGenerationVideoVideoTab";
import LoadingSpinner from "../../../../../shared/components/LoadingSpinner";
import { useDispatch } from "react-redux";
import {
  showFloatingError,
  showFloatingSuccess,
} from "../../../../../shared/store/rootActions";

const TABS = [
  { key: "config", label: "Configuración" },
  { key: "guion", label: "Guión" },
  { key: "video", label: "Video" },
];

const DEFAULT_GUIÓN = "Aqui debe generarse el guion de la actividad.";

const ActivityGenerationVideo = ({
  onClose,
  activityId,
  format,
  courseId,
  handleError,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("config");
  const [configGuionInput, setConfigGuionInput] = useState("");
  const [guionInput, setGuionInput] = useState(DEFAULT_GUIÓN);
  const [guionEdit, setGuionEdit] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [data, setData] = useState({});
  const [activityVideo, setActivityVideo] = useState(null);
  const [fileToken, setFileToken] = useState(null);
  const [videoType, setVideoType] = useState("avatar");
  const [avatarVoice, setAvatarVoice] = useState(null);
  const [videoCreatorApp, setVideoCreatorApp] = useState(null);

  // Avatar selection state
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [avatarsData, setAvatarsData] = useState([]);
  const [loadingAvatars, setLoadingAvatars] = useState(false);
  const [searchAvatar, setSearchAvatar] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarGenerateLoading, setAvatarGenerateLoading] = useState(false); // <-- nuevo estado
  const [videoLoading, setVideoLoading] = useState(false);
  const [scriptRegenerated, setScriptRegenerated] = useState(false); // Track if script has been regenerated
  const [videoGenerated, setVideoGenerated] = useState(false); // Track if video has been generated
  const dispatch = useDispatch();

  const fetchActivity = async () => {
    setModalLoading(true);
    try {
      const response = await getActivityVideo(activityId);
      setData(response.data.activity);
      console.log("Activity data:", response.data.activity);
      if (response.data.video) {
        setActivityVideo(response.data.video);
        setGuionInput(response.data.video.content);
        // If video exists, set appropriate initial states
        if (response.data.video.videoUrl && response.data.video.videoUrl !== "rendering") {
          // Video is already generated, so enable regeneration if script allows it
          setVideoGenerated(true);
          setScriptRegenerated(false); // Initially false, will be set to true when script is modified
        }
        if (response.data.video.videoUrl == "rendering") {
          const videoId = response.data.video.videoId;
          const creatorApp =
            typeof videoId === "string" && (videoId.match(/-/g) || []).length > 2
              ? "videogen"
              : "elai";
          setVideoCreatorApp(creatorApp);
          pollVideoStatus(creatorApp);
        }
      }
      if (response.data.token) {
        setFileToken(response.data.token);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
      dispatch(showFloatingError(t("errorFetchingActivity")));
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [activityId]);

  const pollVideoStatus = async (videoCreatorApp) => {
    const interval = setInterval(async () => {
      try {
        const response = await retrieveActivityVideoStatus(
          activityId,
          videoCreatorApp
        );
        if (response.data.content?.status === "ready") {
          clearInterval(interval);
          setActivityVideo((prev) => ({
            ...prev,
            rawVideo: response.data.url,
          }));
          setVideoLoading(false);
          setAvatarGenerateLoading(false);
          setModalLoading(false);
          setActiveTab("video");
        } else if (response.data.content.status === "failed" || response.data.content.status === "cancelled") {
          clearInterval(interval);
          setVideoLoading(false);
          setAvatarGenerateLoading(false);
          setModalLoading(false);
          dispatch(
          showFloatingError(
            "No se pudo generar el video, hubo un problema en su generacion"
          )
        );
        }
      } catch (error) {
        clearInterval(interval);
        setVideoLoading(false);
        setAvatarGenerateLoading(false);
        setModalLoading(false);
        console.error("Error polling video status:", error.message);
        dispatch(
          showFloatingError(
            "El video aún está generándose, inténtelo más tarde"
          )
        );
      }
    }, 5000); // Poll every 5 seconds
  };

  // Handler para generar script con loading modal y recarga de info
  const handleGenerateScript = async () => {
    setModalLoading(true);
    try {
      const data = {
        PromptInstructions: configGuionInput,
        ActivityId: activityId,
      };
      await generateVideoScript(data);
      await fetchActivity();
      setScriptRegenerated(true); // Mark script as regenerated
      // Only reset videoGenerated if no video exists yet
      setActiveTab("guion"); // <-- Cambia automáticamente al tab de guion
    } catch (error) {
      console.error("Error generating script:", error);
      dispatch(showFloatingError(t("errorGeneratingActivityScript")));
    } finally {
      setModalLoading(false);
    }
  };

  // Handler para regenerar script con loading modal y recarga de info
  const handleRegenerateScript = async () => {
    setModalLoading(true);
    try {
      const data = {
        PromptInstructions: configGuionInput,
        ActivityId: activityId,
      };
      await regenerateVideoScript(data);
      await fetchActivity();
      setScriptRegenerated(true); // Mark script as regenerated
      // Only reset videoGenerated if no video exists yet
      setActiveTab("guion"); // <-- Cambia automáticamente al tab de guion
    } catch (error) {
      console.error("Error regenerating script:", error);
      dispatch(showFloatingError(t("errorGeneratingActivityScript")));
    } finally {
      setModalLoading(false);
    }
  };

  // Parse contentOverview from backend (stringified array)
  let summary = [];
  if (data.contentOverview) {
    try {
      summary = JSON.parse(data.contentOverview);
    } catch {
      summary = [];
    }
  }

  // Manejar el botón atrás según el tab activo y la pantalla de selección de avatar
  const handleBack = () => {
    if (activeTab === "config") {
      onClose();
    } else if (activeTab === "guion") {
      if (showAvatarSelection) {
        setShowAvatarSelection(false); // Volver de selección de avatar a guion
        setSelectedAvatar(null); // Limpiar selección de avatar al volver atrás
      } else {
        setActiveTab("config");
      }
    } else if (activeTab === "video") {
      setActiveTab("guion");
    }
  };

  // Fetch avatars when showAvatarSelection is true and videoType is avatar
  useEffect(() => {
    if (showAvatarSelection && videoType === "avatar") {
      setLoadingAvatars(true);
      getElaiVideoAvatarOptions()
        .then((response) => {
          // Map avatars to { id, name, image }
          const avatars = (response.data || [])
            .filter(
              (a) => a.type === null && a.variants && a.variants.length > 0
            )
            .map((a) => ({
              id: a.code,
              name: a.name,
              image: a.variants[0].canvas, // Use first variant image
              raw: a,
            }));
          setAvatarsData(avatars);
        })
        .catch(() => setAvatarsData([]))
        .finally(() => setLoadingAvatars(false));
    }
  }, [showAvatarSelection, videoType]);

  // Handler for "Continuar" or "Generar" button in guion tab
  const handleContinueGuion = () => {
    if (videoType === "avatar") {
      setShowAvatarSelection(true);
    }
    // For "scene" type, you can add similar logic if needed
  };

  // Handler for "Generar" button in avatar selection screen
  const handleGenerateVideoAvatarScreen = async () => {
    if (videoType === "avatar" && avatarVoice && selectedAvatar) {
      setAvatarGenerateLoading(true);
      setModalLoading(true);
      try {
        const data = {
          ActivityId: activityId,
          Language: "Spanish",
          Voice: avatarVoice.value, // Usa el value del objeto
          VoiceProvider: avatarVoice.voiceProvider || null, // Usa el provider del objeto
          AvatarCode: selectedAvatar.raw?.code
            ? `${selectedAvatar.raw.code}.${selectedAvatar.raw.variants[0].code}`
            : null,
          AvatarGender: selectedAvatar.raw?.gender || null,
          AvatarCanvas:
            selectedAvatar.raw?.variants &&
            selectedAvatar.raw.variants[0]?.canvas
              ? selectedAvatar.raw.variants[0].canvas
              : null,
        };
        const response = await generateElaiActivityVideo(data);
        dispatch(showFloatingSuccess("El video se está generando correctamente"));
        setVideoCreatorApp("elai");
        setActivityVideo((prev) => ({ ...prev, videoUrl: response.data.content }));
        setVideoGenerated(true); // Mark video as generated
        setScriptRegenerated(false); // Reset script regeneration state
        pollVideoStatus("elai");
      } catch (error) {
        console.error("Error generating video:", error);
        if (
          error?.response?.data?.errorMessage?.includes(
            "already has generated content"
          )
        ) {
          dispatch(showFloatingError("Ya existe un video generado"));
        } else {
          dispatch(
          showFloatingError(
            "No se pudo generar el video, hubo un problema en su generacion"
          )
        );
        }
        setAvatarGenerateLoading(false);
        setModalLoading(false);
      }
    }
  };

  // Handler for "Generar" button in guion tab (scene or avatar)
  const handleGenerateVideoGuionTab = async () => {
    if (videoType === "avatar" && avatarVoice) {
      setModalLoading(true);
      try {
        setShowAvatarSelection(true);
      } finally {
        setModalLoading(false);
      }
    } else if (videoType === "scene" && avatarVoice) {
      setModalLoading(true);
      try {
        const data = {
          ActivityId: activityId,
          Language: "Spanish",
          Voice: avatarVoice.value,
          Subtitles: true,
          CaptionFontName: "Verdana",
          BackgroundMusic: true,
        };
        const response = await generateVideogenActivityVideo(data);
        dispatch(showFloatingSuccess("El video se está generando correctamente"));
        setVideoCreatorApp("videogen");
        setActivityVideo((prev) => ({ ...prev, videoUrl: response.data.content }));
        setVideoGenerated(true); // Mark video as generated
        setScriptRegenerated(false); // Reset script regeneration state
        pollVideoStatus("videogen");
      } catch (error) {
        console.error("Error generating scene video:", error);
        if (
          error?.response?.data?.errorMessage?.includes(
            "already has generated content"
          )
        ) {
          dispatch(showFloatingError("Ya existe un video generado"));
        } else {
          dispatch(
          showFloatingError(
            "No se pudo generar el video, hubo un problema en su generacion"
          )
        );
        }
        setModalLoading(false);
      }
    }
  };

  // Handler for "Regenerar" button in avatar selection screen
  const handleRegenerateVideoAvatarScreen = async () => {
    if (videoType === "avatar" && avatarVoice && selectedAvatar) {
      setAvatarGenerateLoading(true);
      setModalLoading(true);
      try {
        // TODO: Implement regeneration service call when available
        // const data = {
        //   ActivityId: activityId,
        //   Language: "Spanish",
        //   Voice: avatarVoice.value,
        //   VoiceProvider: avatarVoice.voiceProvider || null,
        //   AvatarCode: selectedAvatar.raw?.code
        //     ? `${selectedAvatar.raw.code}.${selectedAvatar.raw.variants[0].code}`
        //     : null,
        //   AvatarGender: selectedAvatar.raw?.gender || null,
        //   AvatarCanvas:
        //     selectedAvatar.raw?.variants &&
        //     selectedAvatar.raw.variants[0]?.canvas
        //       ? selectedAvatar.raw.variants[0].canvas
        //       : null,
        // };
        // const response = await regenerateElaiActivityVideo(data);
        
        // Placeholder: Show message that regeneration is not yet available
        dispatch(showFloatingError("La funcionalidad de regeneración aún no está disponible"));
        
        // TODO: Remove these lines when service is implemented
        // dispatch(showFloatingSuccess("El video se está regenerando correctamente"));
        // setVideoCreatorApp("elai");
        // setActivityVideo((prev) => ({ ...prev, videoUrl: response.data.content }));
        // pollVideoStatus("elai");
      } catch (error) {
        console.error("Error regenerating video:", error);
        dispatch(
          showFloatingError(
            "No se pudo regenerar el video, hubo un problema en su regeneración"
          )
        );
      } finally {
        setAvatarGenerateLoading(false);
        setModalLoading(false);
      }
    }
  };

  // Handler for "Regenerar" button in guion tab (scene)
  const handleRegenerateVideoGuionTab = async () => {
    if (videoType === "avatar" && avatarVoice) {
      setModalLoading(true);
      try {
        setShowAvatarSelection(true);
      } finally {
        setModalLoading(false);
      }
    } else if (videoType === "scene" && avatarVoice) {
      setModalLoading(true);
      try {
        // TODO: Implement regeneration service call when available
        // const data = {
        //   ActivityId: activityId,
        //   Language: "Spanish",
        //   Voice: avatarVoice.value,
        //   Subtitles: true,
        //   CaptionFontName: "Verdana",
        //   BackgroundMusic: true,
        // };
        // const response = await regenerateVideogenActivityVideo(data);
        
        // Placeholder: Show message that regeneration is not yet available
        dispatch(showFloatingError("La funcionalidad de regeneración aún no está disponible"));
        
        // TODO: Remove these lines when service is implemented
        // dispatch(showFloatingSuccess("El video se está regenerando correctamente"));
        // setVideoCreatorApp("videogen");
        // setActivityVideo((prev) => ({ ...prev, videoUrl: response.data.content }));
        // pollVideoStatus("videogen");
      } catch (error) {
        console.error("Error regenerating scene video:", error);
        dispatch(
          showFloatingError(
            "No se pudo regenerar el video, hubo un problema en su regeneración"
          )
        );
      } finally {
        setModalLoading(false);
      }
    }
  };

  // Handler when an avatar is selected
  const handleAvatarSelected = (avatar) => {
    setSelectedAvatar(avatar);
    // El card se quedará marcado por selectedAvatar
  };

  // Manejar el cambio de tab y limpiar selección si es necesario
  const handleTabClick = async (tabKey) => {
    if (tabKey === "video") {
      if (videoLoading || avatarGenerateLoading) {
        try {
          // Realiza la misma llamada que el poll para verificar el estado real
          await retrieveActivityVideoStatus(activityId, videoCreatorApp);
        } catch (error) {
          dispatch(
            showFloatingError(
              "El video aún está generándose, inténtelo más tarde"
            )
          );
          return; // Si hay error (404), no cambiar de pestaña
        }
      }
    }

    // Si estamos en guion/avatar selection y vamos a la izquierda, limpiar selección
    if (activeTab === "guion" && showAvatarSelection && tabKey !== "guion") {
      setShowAvatarSelection(false);
      setSelectedAvatar(null);
    }
    setActiveTab(tabKey);
  };

  // Handler for guardar y continuar (puedes personalizar la acción)
  const handleSaveAndContinue = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  // Guardar el guion editado (como en VideoEditor)
  const handleSaveScript = async (text) => {
    setModalLoading(true);
    try {
      const dataToUpdate = {
        content: text || guionInput, // Usa el texto pasado o el estado actual
      };
      await updateVideoContent(activityVideo.id, dataToUpdate);
      setScriptRegenerated(true); // Mark script as regenerated when manually edited
      // Don't reset videoGenerated if video already exists - keep it true to enable regeneration
      // Puedes mostrar un mensaje de éxito si lo deseas
    } catch (error) {
      console.error("Error updating script content:", error);
      dispatch(showFloatingError(t("errorUpdatingDocumentContent")));
    } finally {
      setModalLoading(false);
    }
  };

  if (modalLoading) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 400,
            }}
          >
            <span className={styles.loader}></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className={styles.tabs}>
          {TABS.map((tab, idx) => (
            <div
              key={tab.key}
              className={`${styles.tab} ${
                activeTab === tab.key ? styles.active : ""
              }`}
              onClick={() => handleTabClick(tab.key)}
              style={{ userSelect: "none" }}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <div className={styles.modalContent}>
          {activeTab === "config" && (
            <ActivityGenerationVideoConfigTab
              // Adapted props for new backend data
              data={{
                duration: data.duration,
                contentType: data.contentType,
                name: data.name,
                learningGoal: data.learningGoal,
              }}
              summary={summary}
              guionInput={configGuionInput}
              setGuionInput={setConfigGuionInput}
            />
          )}
          {activeTab === "guion" && (
            <ActivityGenerationVideoGuionTab
              guionInput={guionInput}
              setGuionInput={setGuionInput}
              guionEdit={guionEdit}
              setGuionEdit={setGuionEdit}
              setVideoType={setVideoType}
              videoType={videoType}
              avatarVoice={avatarVoice}
              setAvatarVoice={setAvatarVoice}
              t={t}
              showAvatarSelection={showAvatarSelection}
              setShowAvatarSelection={setShowAvatarSelection}
              onAvatarSelected={handleAvatarSelected}
              avatarsData={avatarsData}
              loadingAvatars={loadingAvatars}
              searchAvatar={searchAvatar}
              setSearchAvatar={setSearchAvatar}
              selectedAvatar={selectedAvatar}
              handleSaveScript={handleSaveScript} // <-- pasar el método
              isScriptGenerated={!!activityVideo}
            />
          )}
          {activeTab === "video" && (
            <ActivityGenerationVideoVideoTab
              activityVideo={activityVideo}
              videoLoading={videoLoading}
              data={data}
              fileToken={fileToken}
              onSaveContinue={handleSaveAndContinue}
            />
          )}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.backBtn} onClick={handleBack}>
            <FontAwesomeIcon className={styles.sparkles} icon={faArrowLeft} />
            Atrás
          </button>
          <>
            {activeTab === "guion" &&
              !showAvatarSelection &&
              (videoType === "avatar" ? (
                <button
                  className={styles.generateBtn}
                  disabled={!avatarVoice}
                  onClick={handleContinueGuion}
                >
                  Continuar{" "}
                  <FontAwesomeIcon
                    className={styles.sparkles}
                    icon={faArrowRight}
                  />
                </button>
              ) : (
                <button
                  onClick={(activityVideo && scriptRegenerated) ? handleRegenerateVideoGuionTab : handleGenerateVideoGuionTab}
                  className={styles.generateBtn}
                  disabled={!avatarVoice || guionInput === DEFAULT_GUIÓN || (activityVideo && !scriptRegenerated)}
                  style={{
                    opacity: (!avatarVoice || guionInput === DEFAULT_GUIÓN || (activityVideo && !scriptRegenerated)) ? 0.3 : 1
                  }}
                >
                  {activityVideo ? "Regenerar" : "Generar"}{" "}
                  <FontAwesomeIcon
                    className={styles.sparkles}
                    icon={faWandSparkles}
                  />
                </button>
              ))}
            {activeTab === "guion" &&
              showAvatarSelection &&
              videoType === "avatar" && (
                <button
                  className={styles.generateBtn}
                  disabled={
                    !avatarVoice || !selectedAvatar || avatarGenerateLoading || (activityVideo && !scriptRegenerated)
                  }
                  style={{
                    opacity:
                      !avatarVoice || !selectedAvatar || avatarGenerateLoading || (activityVideo && !scriptRegenerated)
                        ? 0.3
                        : 1,
                  }}
                  onClick={(activityVideo && scriptRegenerated) ? handleRegenerateVideoAvatarScreen : handleGenerateVideoAvatarScreen}
                >
                  {avatarGenerateLoading ? (activityVideo ? "Regenerando..." : "Generando...") : (activityVideo ? "Regenerar" : "Generar")}{" "}
                  <FontAwesomeIcon
                    className={styles.sparkles}
                    icon={faWandSparkles}
                  />
                </button>
              )}
            {activeTab === "video" && (
              <button
                className={styles.generateBtn}
                onClick={handleSaveAndContinue}
                type="button"
              >
                Finalizar
                <FontAwesomeIcon
                  className={styles.sparkles}
                  icon={faArrowRight}
                  style={{ marginLeft: 8 }}
                />
              </button>
            )}
            {activeTab === "config" &&
              (activityVideo ? (
                <button
                  onClick={handleRegenerateScript}
                  className={styles.generateBtn}
                >
                  {t("regenerateScript")}
                  <FontAwesomeIcon
                    className={styles.sparkles}
                    icon={faWandSparkles}
                  />
                </button>
              ) : (
                <button
                  onClick={handleGenerateScript}
                  className={styles.generateBtn}
                >
                  {t("generateScript")}
                  <FontAwesomeIcon
                    className={styles.sparkles}
                    icon={faWandSparkles}
                  />
                </button>
              ))}
          </>
        </div>
      </div>
    </div>
  );
};

export default ActivityGenerationVideo;
