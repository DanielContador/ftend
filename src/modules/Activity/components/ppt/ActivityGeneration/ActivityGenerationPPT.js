import React, { useState, useEffect } from "react";
import styles from "./ActivityGenerationPPT.module.css";
import { useTranslation } from "react-i18next";
import {
  getActivityPPT,
  generateActivityPPT,
  regenerateActivityPPT,
  updatePPTContent,
} from "../../../services/activityService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faArrowLeft,
  faWandSparkles,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import ActivityGenerationPPTConfigTab from "./ActivityGenerationPPTConfigTab";
import ActivityGenerationPPTPlantillasTab from "./ActivityGenerationPPTPlantillasTab";
import { useDispatch } from "react-redux";
import { showFloatingError } from "../../../../../shared/store/rootActions";

const TABS = [
  { key: "config", label: "Configuración" },
  { key: "document", label: "Plantillas" },
];

const ActivityGenerationPPT = ({
  onClose,
  activityId,
  courseId,
  handleError,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("config");
  const [configInstructions, setConfigInstructions] = useState("");
  const [numSlides, setNumSlides] = useState(10);
  const [data, setData] = useState({});
  const [activityPPT, setActivityPPT] = useState(null);
  const [fileToken, setFileToken] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [pptContent, setPPTContent] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [tempContent, setTempContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [plantillaLoading, setPlantillaLoading] = useState(false);
  const dispatch = useDispatch();

  // Cargar datos de la actividad/PPT
  const fetchActivity = async () => {
    setModalLoading(true);
    try {
      const response = await getActivityPPT(activityId);
      setData(response.data.activity);
      if (response.data.ppt) {
        setActivityPPT(response.data.ppt);
        setPPTContent(response.data.ppt.content);
      }
      if (response.data.token) {
        setFileToken(response.data.token);
      }
    } catch (error) {
      dispatch(showFloatingError(t("errorFetchingActivity")));
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [activityId]);

  // Generar PPT
  const handleGeneratePPT = async () => {
    setModalLoading(true);
    try {
      await generateActivityPPT({
        Prompt: configInstructions,
        NumSlides: numSlides,
        ActivityId: activityId,
      });
      await fetchActivity();
      setActiveTab("document");
    } catch (error) {
      dispatch(showFloatingError(t("errorGeneratingActivityPPT")));
    } finally {
      setModalLoading(false);
    }
  };

  // Regenerar PPT
  const handleRegeneratePPT = async () => {
    setModalLoading(true);
    try {
      await regenerateActivityPPT({
        Prompt: configInstructions,
        ActivityId: activityId,
      });
      await fetchActivity();
      setActiveTab("document");
    } catch (error) {
      dispatch(showFloatingError(t("errorGeneratingActivityPPT")));
    } finally {
      setModalLoading(false);
    }
  };

  // Guardar PPT editado
  const handleSavePPT = async (content) => {
    if (!activityPPT || !activityPPT.id) return;
    setModalLoading(true);
    try {
      await updatePPTContent(activityPPT.id, { Content: content });
      setPPTContent(content);
      setEditMode(false);
    } catch (error) {
      dispatch(showFloatingError(t("errorUpdatingPPTContent")));
    } finally {
      setModalLoading(false);
    }
  };

  // Nueva función para generar PPT con plantilla seleccionada
  const handleGenerateWithTemplate = async () => {
    setPlantillaLoading(true);
    try {
      // Aquí deberías llamar a tu servicio de generación de PPT usando la plantilla seleccionada
      // await generateActivityPPTWithTemplate({ ...otrosDatos, Template: selectedTemplate });
      // Simulación de espera
      await handleGeneratePPT();
    } finally {
      setPlantillaLoading(false);
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
    } else if (activeTab === "document") {
      setActiveTab("config");
    }
  };

  if (modalLoading) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.loaderContainer}>
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
            <ActivityGenerationPPTConfigTab
              data={data}
              summary={summary}
              instructions={configInstructions}
              setInstructions={setConfigInstructions}
              numSlides={numSlides}
              setNumSlides={setNumSlides}
            />
          )}
          {activeTab === "document" && (
            <ActivityGenerationPPTPlantillasTab
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              loading={plantillaLoading}
            />
          )}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.backBtn} onClick={handleBack}>
            <FontAwesomeIcon className={styles.sparkles} icon={faArrowLeft} />
            Atrás
          </button>
          <>
            {activeTab === "config" &&
              (activityPPT ? (
                <button
                  onClick={handleRegeneratePPT}
                  className={styles.generateBtn}
                >
                  {t("regenerateActivity")}
                  <FontAwesomeIcon
                    className={styles.sparkles}
                    icon={faWandSparkles}
                  />
                </button>
              ) : (
                <button
                  onClick={handleGeneratePPT}
                  className={styles.generateBtn}
                >
                  {t("generateActivity")}
                  <FontAwesomeIcon
                    className={styles.sparkles}
                    icon={faWandSparkles}
                  />
                </button>
              ))}
            {activeTab === "document" && (
              <button
                className={styles.generateBtn}
                onClick={handleGenerateWithTemplate}
                type="button"
                disabled={!selectedTemplate || plantillaLoading}
                style={{
                  opacity: !selectedTemplate || plantillaLoading ? 0.3 : 1,
                  cursor:
                    !selectedTemplate || plantillaLoading
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                Generar
                <FontAwesomeIcon
                  className={styles.sparkles}
                  icon={faWandSparkles}
                  style={{ marginLeft: 8 }}
                />
              </button>
            )}
            {activeTab !== "config" && activeTab !== "document" && (
              <button
                className={styles.generateBtn}
                onClick={onClose}
                type="button"
              >
                Finalizar
                <FontAwesomeIcon
                  className={styles.sparkles}
                  icon={faSave}
                  style={{ marginLeft: 8 }}
                />
              </button>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default ActivityGenerationPPT;
