import React, { useState, useEffect } from "react";
import styles from "./ActivityGenerationAudio.module.css";
import { useTranslation } from "react-i18next";
import {
  getActivityAudio,
  updateAudioContent,
  generateActivityAudio,
  generateAudioScript,
  regenerateAudioScript,
  getVoiceOptions,
} from "../../../services/activityService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faArrowLeft,
  faArrowRight,
  faWandSparkles,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import ActivityGenerationAudioConfigTab from "./ActivityGenerationAudioConfigTab";
import ActivityGenerationAudioGuionTab from "./ActivityGenerationAudioGuionTab";
import ActivityGenerationAudioAudioTab from "./ActivityGenerationAudioAudioTab";
import LoadingSpinner from "../../../../../shared/components/LoadingSpinner";

const TABS = [
  { key: "config", label: "Configuración" },
  { key: "guion", label: "Guión" },
  { key: "audio", label: "Audio" },
];

const DEFAULT_GUIÓN = `¿Qué es la IA?
La inteligencia artificial, o IA, se refiere a la capacidad de las máquinas y sistemas informáticos para realizar tareas que normalmente requieren inteligencia humana. Esto incluye procesos como el aprendizaje, el razonamiento, la resolución de problemas, la percepción y la toma de decisiones. En su esencia, la IA busca simular la forma en que los humanos piensan y actúan, utilizando algoritmos y modelos matemáticos para interpretar datos, aprender de la experiencia y adaptarse a nuevas situaciones......`;

const ActivityGenerationAudio = ({
  onClose,
  activityId,
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
  const [activityAudio, setActivityAudio] = useState(null);
  const [fileToken, setFileToken] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  // Estado para voz y sliders
  const [voiceOptions, setVoiceOptions] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [stability, setStability] = useState(50);
  const [similarity, setSimilarity] = useState(50);

  // Cargar datos de la actividad/audio
  const fetchActivity = async () => {
    setLoading(true);
    try {
      const response = await getActivityAudio(activityId);
      setData(response.data.activity);
      if (response.data.audio) {
        setActivityAudio(response.data.audio);
        setGuionInput(response.data.audio.content);
      }
      if (response.data.token) {
        setFileToken(response.data.token);
      }
    } catch (error) {
      handleError(t("errorFetchingActivity"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [activityId]);

  // Cargar voces
  useEffect(() => {
    getVoiceOptions()
      .then((response) => {
        const options = response.data.voices.map((voice) => ({
          value: voice.voice_id,
          label: voice.name,
          preview: voice.preview_url,
        }));
        setVoiceOptions(options);
      })
      .catch(() => setVoiceOptions([]));
  }, []);

  // Generar script
  const handleGenerateScript = async () => {
    setLoading(true);
    try {
      await generateAudioScript({
        Prompt: configGuionInput,
        ActivityId: activityId,
      });
      await fetchActivity();
    } catch (error) {
      handleError(t("errorGeneratingActivityScript"));
    } finally {
      setLoading(false);
    }
  };

  // Regenerar script
  const handleRegenerateScript = async () => {
    setLoading(true);
    try {
      await regenerateAudioScript({
        Prompt: configGuionInput,
        ActivityId: activityId,
      });
      await fetchActivity();
    } catch (error) {
      handleError(t("errorGeneratingActivityScript"));
    } finally {
      setLoading(false);
    }
  };

  // Guardar guion editado
  const handleSaveScript = async () => {
    setLoading(true);
    try {
      await updateAudioContent(activityAudio.id, { content: guionInput });
    } catch (error) {
      handleError(t("errorUpdatingDocumentContent"));
    } finally {
      setLoading(false);
    }
  };

  // Generar audio
  const handleGenerateAudio = async () => {
    setLoading(true);
    try {
      await generateActivityAudio({
        ActivityId: activityId,
        VoiceId: selectedVoice,
        Stability: stability,
        Similarity: similarity,
      });
      setActiveTab("audio");
      setAudioLoading(true);
    } catch (error) {
      handleError(t("errorGeneratingAudio"));
    } finally {
      setLoading(false);
    }
  };

  // Parse contentOverview del backend
  let summary = [];
  if (data.contentOverview) {
    try {
      summary = JSON.parse(data.contentOverview);
    } catch {
      summary = [];
    }
  }

  // Navegación entre tabs
  const handleBack = () => {
    if (activeTab === "config") {
      onClose();
    } else if (activeTab === "guion") {
      setActiveTab("config");
    } else if (activeTab === "audio") {
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
            <ActivityGenerationAudioConfigTab
              data={data}
              summary={summary}
              guionInput={configGuionInput}
              setGuionInput={setConfigGuionInput}
            />
          )}
          {activeTab === "guion" && (
            <ActivityGenerationAudioGuionTab
              guionInput={guionInput}
              setGuionInput={setGuionInput}
              guionEdit={guionEdit}
              setGuionEdit={setGuionEdit}
              voiceOptions={voiceOptions}
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
              stability={stability}
              setStability={setStability}
              similarity={similarity}
              setSimilarity={setSimilarity}
              handleSaveScript={handleSaveScript}
            />
          )}
          {activeTab === "audio" && (
            <ActivityGenerationAudioAudioTab
              activityAudio={activityAudio}
              audioLoading={audioLoading}
              data={data}
              fileToken={fileToken}
            />
          )}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.backBtn} onClick={handleBack}>
            <FontAwesomeIcon className={styles.sparkles} icon={faArrowLeft} />
            Atrás
          </button>
          <>
            {activeTab === "guion" && (
              <button
                className={styles.generateBtn}
                disabled={!selectedVoice}
                onClick={handleGenerateAudio}
              >
                Continuar{" "}
                <FontAwesomeIcon
                  className={styles.sparkles}
                  icon={faArrowRight}
                />
              </button>
            )}
            {activeTab === "audio" && (
              <button
                className={styles.generateBtn}
                type="button"
                onClick={onClose}
                disabled={!activityAudio || !activityAudio.audioUrl}
                style={{
                  opacity: !activityAudio || !activityAudio.audioUrl ? 0.3 : 1,
                  cursor:
                    !activityAudio || !activityAudio.audioUrl
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                Guardar y continuar
                <FontAwesomeIcon
                  className={styles.sparkles}
                  icon={faArrowRight}
                  style={{ marginLeft: 8 }}
                />
              </button>
            )}
            {activeTab === "config" &&
              (activityAudio ? (
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

export default ActivityGenerationAudio;
