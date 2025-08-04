import React, { useState, useEffect } from "react";
import styles from "./ActivityGenerationScorm.module.css";
import { useTranslation } from "react-i18next";
import {
  getActivityDocument,
  generateActivityDocument,
  regenerateActivityDocument,
  updateDocumentContent,
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
      const response = await getActivityDocument(activityId);
      setData(response.data.activity);
      if (response.data.documents && response.data.documents.length > 0) {
        setActivityDocument(response.data.documents[0]);
        setDocumentContent(response.data.documents[0].content);
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
    if (!activityDocument || !activityDocument.id) return;
    setModalLoading(true);
    try {
      // Solo envía las propiedades requeridas y que existan, para evitar nulls innecesarios
      const dataToSend = {
        Content: content,
      };
      if (activityDocument.filePath)
        dataToSend.FilePath = activityDocument.filePath;
      if (activityDocument.fileType)
        dataToSend.FileType = activityDocument.fileType;
      if (activityDocument.prompt) dataToSend.Prompt = activityDocument.prompt;
      if (activityDocument.duration)
        dataToSend.Duration = activityDocument.duration;
      if (typeof activityDocument.includeImages !== "undefined")
        dataToSend.IncludeImages = activityDocument.includeImages;
      if (typeof activityDocument.cantPages !== "undefined")
        dataToSend.CantPages = activityDocument.cantPages;

      await updateDocumentContent(activityDocument.id, dataToSend);
      await fetchActivity(); // Recargar datos para reflejar los cambios
      setDocumentContent(content);
      setEditMode(false);
    } catch (error) {
      dispatch(showFloatingError(t("errorUpdatingDocumentContent")));
    } finally {
      setModalLoading(false);
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
                Guardar y continuar
              </button>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default ActivityGenerationScorm;
