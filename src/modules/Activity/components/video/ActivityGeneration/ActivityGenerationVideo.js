import React, { useState, useEffect } from "react";
import styles from "./ActivityGenerationVideo.module.css";
import { useTranslation } from "react-i18next";
import {
  getActivityVideo,
  updateVideoContent,
  generateVideoScript,
  regenerateVideoScript,
  retrieveActivityVideoStatus,
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

  const handleGenerateScript = async () => {
    setLoading(true);
    try {
      const data = {
        Prompt: instructions,
        ActivityId: activityId,
      };
      const response = await generateVideoScript(data);
      fetchActivity();
      setActiveTab("script");
    } catch (error) {
      console.error("Error generating script:", error);
      handleError(t("errorGeneratingActivityScript")); // Use translation for error message
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
      setGuionInput(response.data.contentGenerated);
      console.log("Script regenerated");
      setActiveTab("script");
    } catch (error) {
      console.error("Error regenerating script:", error);
      handleError(t("errorGeneratingActivityScript")); // Use translation for error message
    } finally {
      setLoading(false);
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

  // Manejar el botón atrás según el tab activo
  const handleBack = () => {
    if (activeTab === "config") {
      onClose();
    } else if (activeTab === "guion") {
      setActiveTab("config");
    } else if (activeTab === "video") {
      setActiveTab("guion");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <div
              key={tab.key}
              className={`${styles.tab} ${
                activeTab === tab.key ? styles.active : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
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
            />
          )}
          {activeTab === "video" && <ActivityGenerationVideoVideoTab />}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.backBtn} onClick={handleBack}>
            <FontAwesomeIcon className={styles.sparkles} icon={faArrowLeft} />
            Atrás
          </button>
          <>
            {activeTab === "guion" && (
              <button className={styles.generateBtn}>
                Continuar{" "}
                <FontAwesomeIcon
                  className={styles.sparkles}
                  icon={faArrowRight}
                />
              </button>
            )}{" "}
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
