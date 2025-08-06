import React, { useState, useEffect } from "react";
import styles from "./ActivityGenerationScorm.module.css";
import { useTranslation } from "react-i18next";
import {
  getActivityDocument,
  generateActivityDocument,
  regenerateActivityDocument,
  updateDocumentContent,
  getScormByActivityId,
  generateActivityScorm,
  regenerateActivityScorm,
} from "../../../services/activityService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faArrowLeft,
  faArrowRight,
  faWandSparkles,
  faDownload,
  faPen,
  faSave,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import ActivityGenerationScormConfigTab from "./ActivityGenerationScormConfigTab";
import ActivityGenerationScormDocumentTab from "./ActivityGenerationScormDocumentTab";
import LoadingSpinner from "../../../../../shared/components/LoadingSpinner";
import { useDispatch } from "react-redux";
import { showFloatingError } from "../../../../../shared/store/rootActions";

const TABS = [
  { key: "config", label: "Configuración" },
  { key: "document", label: "Documento" },
];

const ActivityGenerationScorm = ({
  onClose,
  activityId,
  courseId,
  handleError,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("config");
  const [configInstructions, setConfigInstructions] = useState("");
  const [includeImages, setIncludeImages] = useState(true);
  const [data, setData] = useState({});
  const [activityDocument, setActivityDocument] = useState(null);
  const [fileToken, setFileToken] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [tempContent, setTempContent] = useState("");
  const dispatch = useDispatch();

  // Cargar datos de la actividad/documento SCORM
  const fetchActivity = async () => {
    setModalLoading(true);
    try {
      // Llamar a getActivityDocument para obtener datos del tab de configuración
      const activityResponse = await getActivityDocument(activityId);
      setData(activityResponse.data.activity);
      if (activityResponse.data.token) {
        setFileToken(activityResponse.data.token);
      }

      // Llamar a getScormByActivityId para obtener datos del tab de documento
      try {
        const scormResponse = await getScormByActivityId(activityId);
        console.log("scormResponse:", scormResponse);
        if (scormResponse.success && scormResponse.data) {
          const scormData = scormResponse.data;
          console.log("scormData:", scormData);
          setActivityDocument({
            id: scormData.id,
            content: scormData.content,
            title: scormData.title,
            imagePath: scormData.imagePath,
            imageDescription: scormData.imageDescription,
            config: scormData.config,
          });
          setDocumentContent(scormData.content || "");

          // Para SCORM, usamos el imagePath como token si existe
          if (scormData.imagePath) {
            setFileToken(scormData.imagePath);
          }
        }
      } catch (scormError) {
        console.log("No SCORM data found, this might be a new activity");
        // Si no hay datos SCORM, inicializar con datos vacíos
        setActivityDocument(null);
        setDocumentContent("");
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

  // Generar documento SCORM
  const handleGenerateDocument = async () => {
    setModalLoading(true);
    try {
      const response = await generateActivityScorm({
        ActivityId: activityId,
        PromptInstructions: configInstructions,
        GenerationType: "Internet",
      });
      await fetchActivity();
      setActiveTab("document");
    } catch (error) {
      dispatch(showFloatingError(t("errorGeneratingActivityDocument")));
    } finally {
      setModalLoading(false);
    }
  };

  // Regenerar documento SCORM
  const handleRegenerateDocument = async () => {
    setModalLoading(true);
    try {
      const response = await regenerateActivityScorm({
        ActivityId: activityId,
        PromptInstructions: configInstructions,
        GenerationType: "Internet",
      });
      await fetchActivity();
      setActiveTab("document");
    } catch (error) {
      dispatch(showFloatingError(t("errorGeneratingActivityDocument")));
    } finally {
      setModalLoading(false);
    }
  };

  // Guardar documento SCORM editado
  const handleSaveDocument = async (content) => {
    if (!activityDocument) return;
    setModalLoading(true);
    try {
      // Estructura de datos para SCORM según el ejemplo proporcionado
      const dataToSend = {
        Title: activityDocument.title || data.title || "Título SCORM",
        ImageDescription:
          activityDocument.imageDescription || "Descripción de imagen",
        Content: content,
      };
      console.log("activityDocument", activityDocument);
      await updateScormByActivityId(activityDocument.id, dataToSend);
      await fetchActivity(); // Recargar datos para reflejar los cambios
      setDocumentContent(content);
    } catch (error) {
      dispatch(showFloatingError(t("errorUpdatingDocumentContent")));
    } finally {
      setModalLoading(false);
      setEditMode(false);
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

  const isFinishDisabled = !documentContent || documentContent.trim() === "";

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
            <ActivityGenerationScormConfigTab
              data={data}
              summary={summary}
              instructions={configInstructions}
              setInstructions={setConfigInstructions}
              includeImages={includeImages}
              setIncludeImages={setIncludeImages}
            />
          )}
          {activeTab === "document" && (
            <ActivityGenerationScormDocumentTab
              documentContent={documentContent}
              setDocumentContent={setDocumentContent}
              editMode={editMode}
              setEditMode={setEditMode}
              tempContent={tempContent}
              setTempContent={setTempContent}
              handleSaveDocument={handleSaveDocument}
              activityDocument={activityDocument}
              fileToken={fileToken}
              data={data}
              activityId={activityId}
              fetchActivity={fetchActivity}
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
              (activityDocument ? (
                <button
                  onClick={handleRegenerateDocument}
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
                  onClick={handleGenerateDocument}
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
                onClick={onClose}
                type="button"
                disabled={isFinishDisabled}
                style={{
                  opacity: isFinishDisabled ? 0.5 : 1,
                  cursor: isFinishDisabled ? "not-allowed" : "pointer",
                }}
              >
                Finalizar
              </button>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default ActivityGenerationScorm;
