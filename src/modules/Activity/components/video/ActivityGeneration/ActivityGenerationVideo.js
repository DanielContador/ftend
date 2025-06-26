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

const TABS = [
  { key: "config", label: "Configuración" },
  { key: "guion", label: "Guión" },
  { key: "video", label: "Video" },
];

const DEFAULT_GUIÓN = `¿Qué es la IA?
La inteligencia artificial, o IA, se refiere a la capacidad de las máquinas y sistemas informáticos para realizar tareas que normalmente requieren inteligencia humana. Esto incluye procesos como el aprendizaje, el razonamiento, la resolución de problemas, la percepción y la toma de decisiones. En su esencia, la IA busca simular la forma en que los humanos piensan y actúan, utilizando algoritmos y modelos matemáticos para interpretar datos, aprender de la experiencia y adaptarse a nuevas situaciones......`;

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
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [activityVideo, setActivityVideo] = useState(null);
  const [fileToken, setFileToken] = useState(null);
  const [videoType, setVideoType] = useState("avatar");
  const [avatarVoice, setAvatarVoice] = useState(null);

  // Avatar selection state
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [avatarsData, setAvatarsData] = useState([]);
  const [loadingAvatars, setLoadingAvatars] = useState(false);
  const [searchAvatar, setSearchAvatar] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarGenerateLoading, setAvatarGenerateLoading] = useState(false); // <-- nuevo estado
  const [videoLoading, setVideoLoading] = useState(false);

  // Nuevo estado para loading local del modal (spinner centrado)
  const [modalLoading, setModalLoading] = useState(false);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const response = await getActivityVideo(activityId);
      setData(response.data.activity);
      console.log("Activity data:", response.data.activity);
      if (response.data.video) {
        setActivityVideo(response.data.video);
        setGuionInput(response.data.video.content);
        if (response.data.video.videoUrl == "rendering") {
          const videoId = response.data.video.videoId;
          if (
            typeof videoId === "string" &&
            (videoId.match(/-/g) || []).length > 2
          ) {
            pollVideoStatus("videogen");
          } else {
            pollVideoStatus("elai");
          }
        }
      }
      if (response.data.token) {
        setFileToken(response.data.token);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
      handleError(t("errorFetchingActivity"));
    } finally {
      setLoading(false);
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
        } else if (response.data.content.status !== "rendering") {
          clearInterval(interval);
          setVideoLoading(false);
          handleError(t("errorGeneratingVideo"));
        }
      } catch (error) {
        clearInterval(interval);
        setVideoLoading(false);
        console.error("Error polling video status:", error.message);
        handleError(t("errorGeneratingVideo") + ": " + error.message);
      }
    }, 5000); // Poll every 5 seconds
  };

  // Handler para generar script con loading modal y recarga de info
  const handleGenerateScript = async () => {
    setModalLoading(true);
    try {
      const data = {
        Prompt: guionInput,
        ActivityId: activityId,
      };
      await generateVideoScript(data);
      await fetchActivity(); // recarga la info y mantiene el tab
      // No cambiar el tab, mantener el actual
    } catch (error) {
      console.error("Error generating script:", error);
      handleError(t("errorGeneratingActivityScript"));
    } finally {
      setModalLoading(false);
    }
  };

  // Handler para regenerar script con loading modal y recarga de info
  const handleRegenerateScript = async () => {
    setModalLoading(true);
    try {
      const data = {
        Prompt: guionInput,
        ActivityId: activityId,
      };
      await regenerateVideoScript(data);
      await fetchActivity(); // recarga la info y mantiene el tab
      // No cambiar el tab, mantener el actual
    } catch (error) {
      console.error("Error regenerating script:", error);
      handleError(t("errorGeneratingActivityScript"));
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
      try {
        const data = {
          ActivityId: activityId,
          Language: "Spanish",
          Voice: avatarVoice,
          VoiceProvider: null, // Set if needed
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
        activityVideo.videoUrl = response.data.content;
        setActivityVideo(activityVideo);
        setActiveTab("video");
        setVideoLoading(true);
        pollVideoStatus("elai");
      } catch (error) {
        console.error("Error generating video:", error);
        handleError(t("errorGeneratingVideo"));
      } finally {
        setAvatarGenerateLoading(false);
      }
    }
  };

  // Handler for "Generar" button in guion tab (scene or avatar)
  const handleGenerateVideoGuionTab = async () => {
    if (videoType === "avatar" && avatarVoice) {
      setLoading(true);
      try {
        setShowAvatarSelection(true);
      } finally {
        setLoading(false);
      }
    } else if (videoType === "scene" && avatarVoice) {
      setLoading(true);
      try {
        // Aquí iría la lógica para generar video tipo scene
        // Simulación: después de generar, mostrar el tab de video
        setActiveTab("video");
        setVideoLoading(true);
        // Aquí deberías llamar a tu endpoint de generación de video de escenas y luego pollVideoStatus('videogen')
      } finally {
        setLoading(false);
      }
    }
  };

  // Handler when an avatar is selected
  const handleAvatarSelected = (avatar) => {
    setSelectedAvatar(avatar);
    // El card se quedará marcado por selectedAvatar
  };

  // Manejar el cambio de tab y limpiar selección si es necesario
  const handleTabClick = (tabKey) => {
    // Si estamos en guion/avatar selection y vamos a la izquierda, limpiar selección
    if (activeTab === "guion" && showAvatarSelection && tabKey !== "guion") {
      setShowAvatarSelection(false);
      setSelectedAvatar(null);
    }
    setActiveTab(tabKey);
  };

  // Handler for guardar y continuar (puedes personalizar la acción)
  const handleSaveAndContinue = () => {
    // Aquí puedes agregar la lógica para guardar y continuar
    // Por ejemplo, cerrar el modal o avanzar a otro paso
  };

  // Guardar el guion editado (como en VideoEditor)
  const handleSaveScript = async () => {
    setLoading(true);
    try {
      const dataToUpdate = {
        content: guionInput,
      };
      await updateVideoContent(activityVideo.id, dataToUpdate);
      // Puedes mostrar un mensaje de éxito si lo deseas
    } catch (error) {
      console.error("Error updating script content:", error);
      handleError(t("errorUpdatingDocumentContent"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
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
                  className={styles.generateBtn}
                  disabled={!avatarVoice}
                  onClick={handleGenerateVideoGuionTab}
                >
                  Generar{" "}
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
                    !avatarVoice || !selectedAvatar || avatarGenerateLoading
                  }
                  style={{
                    opacity:
                      !avatarVoice || !selectedAvatar || avatarGenerateLoading
                        ? 0.1
                        : 1,
                  }}
                  onClick={handleGenerateVideoAvatarScreen}
                >
                  {avatarGenerateLoading ? "Generando..." : "Generar"}{" "}
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
                Salvar y continuar
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
