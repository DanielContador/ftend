import React, { useState, useEffect } from "react";
import styles from "./ActivityGenerationPPT.module.css";
import { useTranslation } from "react-i18next";
import {
  getActivityPPT,
  generateActivityPPT, // Usaremos esta para todo
  updatePPTContent,
  retrieveActivityPPTStatus,
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
import ActivityGenerationPPTTab from "./ActivityGenerationPPTTab";
import { useDispatch } from "react-redux";
import { showFloatingError } from "../../../../../shared/store/rootActions";

const TABS = [
  { key: "config", label: "Configuración" },
  { key: "slides", label: "Plantillas" },
  { key: "ppt", label: "PPT" },
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
  const [isGenerating, setIsGenerating] = useState(false);
  const dispatch = useDispatch();

  // Cargar datos de la actividad/PPT
  const fetchActivity = async () => {
    setModalLoading(true);
    try {
      const response = await getActivityPPT(activityId);
      setData(response.data.activity);
      if (response.data.powerPoint) {
        setActivityPPT(response.data.powerPoint);
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

  // Función para generar PPT con plantilla seleccionada
  const handleGenerate = async () => {
    if (activityPPT) {
      dispatch(
        showFloatingError(
          "Ya existe una presentación generada. Si deseas una nueva, elimínala primero."
        )
      );
      setActiveTab("ppt"); // Lleva al usuario a ver el PPT que ya existe
      return;
    }

    const instructions = configInstructions;
    const template = selectedTemplate;
    setIsGenerating(true);

    const payload = {
      activityId: activityId,
      prompt_instructions: instructions || "",
      amount_slides: numSlides || 10,
      Template: template ? template.name : "default",
      // Valores por defecto como en PPTEditor
      tone: "educational",
      verbosity: "standard",
      fetch_images: true,
    };

    try {
      await generateActivityPPT(payload);
      setActiveTab("ppt"); // Cambia de tab DESPUÉS de iniciar la generación
      pollPPTStatus(); // Inicia el sondeo para verificar el estado del PPT
    } catch (error) {
      dispatch(showFloatingError("Error al iniciar la generación del PPT."));
      setIsGenerating(false);
      setActiveTab("slides"); // Devuelve al usuario a la pestaña anterior en caso de error
    }
  };

  const pollPPTStatus = async () => {
    const interval = setInterval(async () => {
      try {
        const response = await retrieveActivityPPTStatus(activityId);
        if (response.data.content?.status === "ready") {
          clearInterval(interval);
          setIsGenerating(false);
          fetchActivity(); // ¡Clave! Refrescar toda la data para consistencia.
        } else if (response.data.content?.status === "error") {
          clearInterval(interval);
          setIsGenerating(false);
          dispatch(showFloatingError("Error durante la generación del PPT."));
        }
      } catch (error) {
        clearInterval(interval);
        setIsGenerating(false);
        dispatch(showFloatingError("Error al verificar el estado del PPT."));
      }
    }, 5000); // Sondeo cada 5 segundos
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
    } else if (activeTab === "slides") {
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
          {activeTab === "slides" && (
            <ActivityGenerationPPTPlantillasTab
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              loading={plantillaLoading}
            />
          )}
          {activeTab === "ppt" && (
            <ActivityGenerationPPTTab
              pptData={activityPPT}
              isLoading={isGenerating}
              fileToken={fileToken}
              pptId={activityPPT?.activityId}
            />
          )}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.backBtn} onClick={handleBack}>
            <FontAwesomeIcon className={styles.sparkles} icon={faArrowLeft} />
            Atrás
          </button>
          <>
            {activeTab === "config" && (
              <button
                onClick={() => setActiveTab("slides")}
                className={styles.generateBtn}
              >
                Continuar
                <FontAwesomeIcon
                  className={styles.sparkles}
                  icon={faArrowLeft}
                  style={{ transform: "rotate(180deg)", marginLeft: 8 }}
                />
              </button>
            )}
            {activeTab === "slides" && (
              <button
                className={styles.generateBtn}
                onClick={handleGenerate}
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
            {activeTab === "ppt" && (
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
