import React, { useState, useEffect } from "react";
import styles from "./CourseSectionActivity.module.css";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFolderOpen,
  faDownload,
  faWandMagicSparkles,
  faPen,
  faFloppyDisk,
  faXmark,
  faPlus,
  faChevronDown,
  faChevronUp,
  faCirclePlay,
  faFilePdf,
  faHeadphones,
  faFilePowerpoint,
  faDesktop,
} from "@fortawesome/free-solid-svg-icons";
import {
  getActivityPPT,
  getActivityVideo,
  getActivityAudio,
  getActivityDocument,
} from "../../../Activity/services/activityService";
import EvaluationGeneration from "./EvaluationGeneration";
import EvaluationEdition from "./EvaluationEdition";
import CourseExportManager from "../../../FileDownloadManager/components/CourseExportManager";

// Mapea el formato del backend a los iconos y colores igual que en CourseEdition
const iconByType = {
  Video: <FontAwesomeIcon className={styles.iconVideo} icon={faCirclePlay} />,
  PDF: <FontAwesomeIcon className={styles.iconPDF} icon={faFilePdf} />,
  Audio: <FontAwesomeIcon className={styles.iconAudio} icon={faHeadphones} />,
  PPT: <FontAwesomeIcon className={styles.iconPPT} icon={faFilePowerpoint} />,
  SCORM: <FontAwesomeIcon className={styles.iconSCORM} icon={faDesktop} />,
};

const tabs = [
  { key: "contenido", label: "Creación de contenido" },
  { key: "exportar", label: "Exportar" },
];

// Mapa de servicios y claves de datos para cada formato
const serviceMap = {
  PPT: {
    get: getActivityPPT,
    checker: (data) => !!data.powerPoint,
    urlPath: "ppt",
  },
  Video: {
    get: getActivityVideo,
    checker: (data) => !!data.video,
    urlPath: "video",
  },
  Audio: {
    get: getActivityAudio,
    checker: (data) => !!data.audio,
    urlPath: "audio",
  },
  PDF: {
    get: getActivityDocument,
    checker: (data) => data.documents && data.documents.length > 0,
    urlPath: "pdf",
  },
  SCORM: {
    get: getActivityDocument, // Using document service for now as requested
    checker: (data) => data.documents && data.documents.length > 0,
    urlPath: "scorm",
  },
};

const CourseSectionActivity = ({
  courseStructure,
  handleError,
  courseId,
  handleRegenerate,
  handleUpdateActivityTitle,
  selectedTab,
  setSelectedTab,
  onEvaluationStatusChange,
  onFetchQuizzes,
  existingQuestions,
  quizzesId,
  onGenerateEvaluation,
  onRegenerateEvaluation,
  onAddQuizAnswers,
  onUpdateQuizAnswers,
  onDeleteQuizAnswers,
  onAddQuizQuestions,
  onUpdateQuizQuestions,
  onDeleteQuizQuestions,
  generatedQuestions,
  triggerEvaluationView,
}) => {
  console.log("CourseSectionActivity props:", courseStructure);
  const router = useRouter();
  const modules = courseStructure?.modules || [];
  const [selectedModuleId, setSelectedModuleId] = useState(
    modules.length > 0 ? modules[0].id : null
  );
  const [selectedType, setSelectedType] = useState("PPT");
  const [contentInput, setContentInput] = useState("");
  const [expandedResource, setExpandedResource] = useState(null);

  // Edición de título de recurso (card)
  const [editingResource, setEditingResource] = useState({});

  // Estado para modal de generación de video
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoModalData, setVideoModalData] = useState(null);
  const [videoModalKey, setVideoModalKey] = useState(0); // <--- nuevo estado para forzar reinicio
  const [downloadableStatus, setDownloadableStatus] = useState({});

  // Estado para mostrar la vista de evaluación dentro del tab de contenido
  const [showEvaluationView, setShowEvaluationView] = useState(false);

  const selectedModule =
    modules.find((mod) => mod.id === selectedModuleId) || modules[0];

  const moduleEvaluation = selectedModule?.learning_objects.find((lo) =>
    lo.format.toLowerCase().includes("evaluacion")
  );

  const handleAddQuizAnswersWrapper = (quizAnswerData) => {
    if (moduleEvaluation?.id) {
      onAddQuizAnswers(quizAnswerData, moduleEvaluation.id);
    }
  };

  const handleUpdateQuizAnswersWrapper = (answerId, quizAnswerData) => {
    if (moduleEvaluation?.id) {
      onUpdateQuizAnswers(answerId, quizAnswerData, moduleEvaluation.id);
    }
  };

  const handleDeleteQuizAnswersWrapper = (answerId) => {
    if (moduleEvaluation?.id) {
      onDeleteQuizAnswers(answerId, moduleEvaluation.id);
    }
  };

  const handleAddQuizQuestionsWrapper = async (quizQuestionData) => {
    if (moduleEvaluation?.id) {
      return await onAddQuizQuestions(quizQuestionData, moduleEvaluation.id);
    }
    return null;
  };

  const handleUpdateQuizQuestionsWrapper = (questionId, quizQuestionData) => {
    if (moduleEvaluation?.id) {
      onUpdateQuizQuestions(questionId, quizQuestionData, moduleEvaluation.id);
    }
  };

  const handleDeleteQuizQuestionsWrapper = (questionId) => {
    if (moduleEvaluation?.id) {
      onDeleteQuizQuestions(questionId, moduleEvaluation.id);
    }
  };

  // Función para manejar la generación de evaluación
  const handleEvaluationGenerate = async (evaluationConfig, onComplete) => {
    console.log("Generando evaluación con configuración:", evaluationConfig);
    if (onGenerateEvaluation && moduleEvaluation?.id) {
      const evaluationData = {
        ActivityId: moduleEvaluation.id,
        Prompt: evaluationConfig.Prompt || "",
        Multiple_Choise: evaluationConfig.Multiple_Choise,
        Cant_Answers: evaluationConfig.Cant_Answers,
        QuestionCount: evaluationConfig.QuestionCount,
        MinPassingScore: evaluationConfig.MinPassingScore,
      };

      try {
        await onGenerateEvaluation(evaluationData);
        // Después de generar, se actualizan las preguntas y se llama al callback
        if (onFetchQuizzes) {
          await onFetchQuizzes(moduleEvaluation.id);
          setShowEvaluationView(true);
          if (onComplete) {
            onComplete();
          }
          // Ahora la vista cambia a edición solo cuando las preguntas están listas y el loading desaparece
        }
      } catch (error) {
        console.error("Error during evaluation generation:", error);
        // Si hay error, apaga el loading pero NO cambia la vista
        if (onComplete) {
          onComplete();
        }
      }
    }
  };

  // Función para volver de EvaluationGeneration a section activities
  const handleBackToSectionActivities = () => {
    setShowEvaluationView(false);
  };

  const hasExistingQuestions = () => {
    // Verificar generatedQuestions
    if (generatedQuestions && generatedQuestions.length > 0) {
      return true;
    }
    // Verificar existingQuestions
    if (existingQuestions && existingQuestions.length > 0) {
      return true;
    }
    // Verificar quizData en moduleEvaluation
    if (moduleEvaluation?.quizData) {
      try {
        const parsedData = JSON.parse(moduleEvaluation.quizData);
        if (parsedData.questions && parsedData.questions.length > 0) {
          return true;
        }
      } catch (error) {
        console.error("Error parsing quizData:", error);
      }
    }
    return false;
  };

  // Get the first activity that has exportable content
  const getFirstExportableActivity = () => {
    if (!selectedModule || !selectedModule.learning_objects) {
      return null;
    }
    
    return selectedModule.learning_objects.find(activity => {
      return downloadableStatus[activity.id] === true;
    });
  };

  // Check if there's any exportable content in the module
  const hasExportableContent = () => {
    if (!selectedModule || !selectedModule.learning_objects) {
      return false;
    }
    
    return selectedModule.learning_objects.some(activity => {
      return downloadableStatus[activity.id] === true;
    });
  };

  useEffect(() => {
    onEvaluationStatusChange(!!moduleEvaluation);
  }, [moduleEvaluation, onEvaluationStatusChange]);

  // Reset evaluation view when changing modules or tabs
  useEffect(() => {
    setShowEvaluationView(false);
  }, [selectedModule, selectedTab]);

  // Fetch quizzes when evaluation view is shown and there's a module evaluation
  useEffect(() => {
    if (showEvaluationView && moduleEvaluation?.id) {
      onFetchQuizzes(moduleEvaluation.id);
    }
  }, [showEvaluationView, moduleEvaluation?.id]);

  // Handle trigger from parent component ("Siguiente" button)
  useEffect(() => {
    if (triggerEvaluationView) {
      // Use the same logic as moduleEvaluation to check for evaluation activity
      if (moduleEvaluation) {
        console.log("Triggering evaluation view from Siguiente button");
        setShowEvaluationView(true);
      } else {
        console.log(
          "No evaluation activity found when triggering from Siguiente button"
        );
      }
    }
  }, [triggerEvaluationView, moduleEvaluation]);

  useEffect(() => {
    const checkAllActivitiesDownloadStatus = async () => {
      if (!selectedModule || !selectedModule.learning_objects) {
        return;
      }

      const statusPromises = selectedModule.learning_objects.map(
        async (activity) => {
          const serviceConfig = serviceMap[activity.format];
          if (!serviceConfig) {
            return { id: activity.id, isDownloadable: false };
          }
          try {
            const response = await serviceConfig.get(activity.id);
            return {
              id: activity.id,
              isDownloadable: serviceConfig.checker(response.data),
            };
          } catch (error) {
            return { id: activity.id, isDownloadable: false };
          }
        }
      );

      const statuses = await Promise.all(statusPromises);
      const newStatus = statuses.reduce((acc, current) => {
        acc[current.id] = current.isDownloadable;
        return acc;
      }, {});

      setDownloadableStatus(newStatus);
    };

    checkAllActivitiesDownloadStatus();
  }, [selectedModule]);

  const handleCardToggle = (resourceId) => {
    setExpandedResource((prev) => (prev === resourceId ? null : resourceId));
  };

  // Iniciar edición de un recurso
  const handleEditClick = (objectId, currentValue) => {
    setEditingResource((prev) => ({
      ...prev,
      [objectId]: {
        editing: true,
        value: currentValue,
        original: currentValue,
      },
    }));
  };

  // Manejar cambio en el input de edición de object_title
  const handleResourceTitleChange = (objectId, e) => {
    const value = e.target.value;
    setEditingResource((prev) => ({
      ...prev,
      [objectId]: { ...prev[objectId], value },
    }));
  };

  // Guardar el cambio (llamar backend)
  const handleSaveClick = async (moduleId, objectId) => {
    const newTitle = editingResource[objectId]?.value;
    if (newTitle && newTitle.trim() !== "") {
      await handleUpdateActivityTitle(newTitle, objectId);
    }
    setEditingResource((prev) => ({
      ...prev,
      [objectId]: { editing: false, value: newTitle, original: newTitle },
    }));
  };

  // Cancelar edición
  const handleDownload = async (resource) => {
    if (!resource || !resource.id || !resource.format) {
      console.error("Invalid resource for download");
      return;
    }

    const serviceConfig = serviceMap[resource.format];
    if (!serviceConfig) {
      console.error(`No service configuration for format: ${resource.format}`);
      return;
    }

    try {
      // 1. Obtener el token para la descarga
      const response = await serviceConfig.get(resource.id);
      const token = response?.data?.token;

      if (!token) {
        console.error("Failed to retrieve download token.");
        return;
      }

      // 2. Construir la URL de descarga usando la configuración del serviceMap
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/download/${serviceConfig.urlPath}/file/${resource.id}?token=${token}`;

      // 3. Abrir la URL para iniciar la descarga
      window.open(downloadUrl, "_blank");
    } catch (error) {
      console.error(
        `Error during download process for ${resource.format}:`,
        error
      );
    }
  };

  const handleCancelClick = (objectId) => {
    setEditingResource((prev) => ({
      ...prev,
      [objectId]: {
        editing: false,
        value: prev[objectId].original,
        original: prev[objectId].original,
      },
    }));
  };

  const handleGoToActivity = (format, activityId) => {
    console.log("format:", format);
    console.log("activityId:", activityId);
    router.push(
      `/course/${courseId}/edit/activity/?id=${activityId}&format=${format}`
    ); // Redirect to the activity edit page
  };

  return (
    <div className={styles.sectionContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Estructura del curso</div>
        <nav>
          <ul className={styles.moduleList}>
            {modules.map((mod) => (
              <li
                key={mod.id}
                className={
                  mod.id === selectedModuleId
                    ? `${styles.moduleItem} ${styles.activeModule}`
                    : styles.moduleItem
                }
                onClick={() => {
                  if (selectedTab === "evaluacion") {
                    const newModule = modules.find((m) => m.id === mod.id);
                    const hasEvaluation = newModule?.learning_objects.some(
                      (lo) => lo.format.toLowerCase().includes("evaluacion")
                    );
                    if (!hasEvaluation) {
                      handleError(
                        "No se puede cambiar a un módulo sin evaluación desde esta pestaña."
                      );
                      return;
                    }
                  }
                  setSelectedModuleId(mod.id);
                }}
              >
                <FontAwesomeIcon
                  icon={mod.id === selectedModuleId ? faFolderOpen : faFolder}
                  className={
                    mod.id === selectedModuleId
                      ? styles.folderIconActive
                      : styles.folderIcon
                  }
                />
                <span>
                  {mod.module_title ? mod.module_title : `Módulo ${mod.id}`}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className={styles.bodyContent}>
        <div className={styles.tabsBar}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tabItem} ${
                selectedTab === tab.key ? styles.tabItemActive : ""
              } ${
                tab.key === "evaluacion" && !moduleEvaluation
                  ? styles.disabledTab
                  : ""
              }`}
              onClick={() => {
                if (tab.key === "evaluacion" && !moduleEvaluation) {
                  handleError(
                    "No hay evaluación en este módulo para poder acceder a esta pestaña."
                  );
                  return;
                }
                setSelectedTab(tab.key);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <main
          className={`${styles.sectionMain} ${
            selectedTab === "evaluacion" ? styles.sectionMainExpanded : ""
          }`}
        >
          {selectedTab === "contenido" && (
            <>
              {showEvaluationView ? (
                hasExistingQuestions() ? (
                  <EvaluationEdition
                    moduleEvaluation={moduleEvaluation}
                    onBack={handleBackToSectionActivities}
                    onSave={(questions) => {
                      console.log("Saving questions:", questions);
                      // Aquí se puede implementar la lógica para guardar las preguntas editadas
                    }}
                    questions={existingQuestions || generatedQuestions || []}
                    quizzesId={quizzesId}
                    onRegenerateEvaluation={onRegenerateEvaluation}
                    onAddQuizAnswers={handleAddQuizAnswersWrapper}
                    onUpdateQuizAnswers={handleUpdateQuizAnswersWrapper}
                    onDeleteQuizAnswers={handleDeleteQuizAnswersWrapper}
                    onAddQuizQuestions={handleAddQuizQuestionsWrapper}
                    onUpdateQuizQuestions={handleUpdateQuizQuestionsWrapper}
                    onDeleteQuizQuestions={handleDeleteQuizQuestionsWrapper}
                  />
                ) : (
                  <EvaluationGeneration
                    onGenerate={handleEvaluationGenerate}
                    moduleEvaluation={moduleEvaluation}
                    onBack={handleBackToSectionActivities}
                  />
                )
              ) : (
                <>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h2 className={styles.sectionTitle}>
                        {selectedModule?.module_title
                          ? selectedModule.module_title
                          : `Módulo ${selectedModule?.id}`}
                      </h2>
                      <div className={styles.sectionSubtitle}>
                        {selectedModule?.learning_objects
                          ? `Recursos: ${selectedModule.learning_objects.length}`
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className={styles.resourceList}>
                    {selectedModule?.learning_objects &&
                      selectedModule.learning_objects.map((res) => {
                        const expanded = expandedResource === res.id;
                        const isEditing = editingResource[res.id]?.editing;
                        const editValue =
                          editingResource[res.id]?.value ?? res.object_title;
                        return (
                          <div
                            key={res.id}
                            className={
                              expanded
                                ? `${styles.resourceCard} ${styles.resourceCardExpanded}`
                                : styles.resourceCard
                            }
                            onClick={() => handleCardToggle(res.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex">
                              <div className="mt-4">
                                {iconByType[res.format] || (
                                  <FontAwesomeIcon
                                    className={styles.iconPPT}
                                    icon={faFilePowerpoint}
                                  />
                                )}
                              </div>
                              <div className="w-100">
                                <div className={styles.resourceCardHeader}>
                                  <div className={styles.resourceCardTitle}>
                                    {isEditing ? (
                                      <>
                                        <input
                                          type="text"
                                          value={editValue}
                                          onChange={(e) =>
                                            handleResourceTitleChange(res.id, e)
                                          }
                                          className={styles.input}
                                          style={{
                                            fontWeight: 600,
                                            fontSize: "1.09rem",
                                            padding: "4px 8px",
                                            minWidth: 120,
                                            maxWidth: 400,
                                            marginRight: 8,
                                          }}
                                          autoFocus
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <button
                                          className={styles.editIcon}
                                          title="Guardar"
                                          style={{
                                            background: "none",
                                            border: "none",
                                            color: "#7c3aed",
                                            marginLeft: 2,
                                            fontSize: 18,
                                            cursor: "pointer",
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSaveClick(
                                              selectedModule.id,
                                              res.id
                                            );
                                          }}
                                        >
                                          <FontAwesomeIcon
                                            icon={faFloppyDisk}
                                          />
                                        </button>
                                        <button
                                          className={styles.editIcon}
                                          title="Cancelar"
                                          style={{
                                            background: "none",
                                            border: "none",
                                            color: "#e53e3e",
                                            marginLeft: 2,
                                            fontSize: 18,
                                            cursor: "pointer",
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCancelClick(res.id);
                                          }}
                                        >
                                          <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <span
                                          className={styles.resourceTitleText}
                                        >
                                          {res.object_title}
                                        </span>
                                        <FontAwesomeIcon
                                          icon={faPen}
                                          className={styles.editIcon}
                                          title="Editar"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(
                                              res.id,
                                              res.object_title
                                            );
                                          }}
                                        />
                                      </>
                                    )}
                                  </div>
                                  <div className={styles.resourceCardActions}>
                                    <button
                                      className={`${styles.downloadBtn} ${
                                        !downloadableStatus[res.id]
                                          ? styles.disabled
                                          : ""
                                      }`}
                                      title={
                                        downloadableStatus[res.id]
                                          ? "Descargar"
                                          : "No hay contenido para descargar"
                                      }
                                      disabled={!downloadableStatus[res.id]}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (downloadableStatus[res.id]) {
                                          handleDownload(res);
                                        }
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faDownload} />
                                    </button>
                                    <button
                                      className={styles.generateBtn}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (
                                          res.format
                                            .toLowerCase()
                                            .includes("evaluacion")
                                        ) {
                                          setShowEvaluationView(true);
                                        } else {
                                          handleGoToActivity(
                                            res.format,
                                            res.id
                                          );
                                        }
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faWandMagicSparkles}
                                      />
                                      <span>Generar</span>
                                    </button>
                                  </div>
                                </div>
                                <div className={styles.resourceCardBody}>
                                  {expanded ? (
                                    <>
                                      {res.estimated_time && (
                                        <div className={styles.resourceDetail}>
                                          Duración: {res.estimated_time} minutos
                                        </div>
                                      )}
                                      {res.format && (
                                        <div className={styles.resourceDetail}>
                                          <span
                                            className={
                                              styles.resourceDetailLabel
                                            }
                                          >
                                            Formato:
                                          </span>{" "}
                                          {res.format}
                                        </div>
                                      )}
                                      {/* Arreglo para parsear correctamente el contenido */}
                                      {res.content &&
                                        Array.isArray(res.content) &&
                                        (() => {
                                          let parsedContent = [];
                                          try {
                                            // El backend envía un array con un string JSON adentro
                                            if (
                                              res.content.length === 1 &&
                                              typeof res.content[0] === "string"
                                            ) {
                                              parsedContent = JSON.parse(
                                                res.content[0]
                                              );
                                            } else {
                                              parsedContent = res.content;
                                            }
                                          } catch (e) {
                                            parsedContent = [];
                                          }
                                          return parsedContent.length > 0 ? (
                                            <>
                                              <div
                                                className={
                                                  styles.resourceDetail
                                                }
                                              >
                                                <span
                                                  className={
                                                    styles.resourceDetailLabel
                                                  }
                                                >
                                                  Resumen de contenido:
                                                </span>
                                              </div>
                                              <ul
                                                className={
                                                  styles.resourceSummaryList
                                                }
                                              >
                                                {parsedContent.map(
                                                  (item, idx) => (
                                                    <li
                                                      key={idx}
                                                      className={
                                                        styles.resourceSummaryItem
                                                      }
                                                    >
                                                      {item}
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            </>
                                          ) : null;
                                        })()}
                                    </>
                                  ) : (
                                    res.format && (
                                      <div className={styles.resourceDetail}>
                                        <span
                                          className={styles.resourceDetailLabel}
                                        >
                                          Formato:
                                        </span>{" "}
                                        {res.format}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className={styles.addContentBar}>
                    <input
                      className={styles.addContentInput}
                      placeholder="Agregar Contenido..."
                      value={contentInput}
                      onChange={(e) => setContentInput(e.target.value)}
                    />
                    <button className={styles.addContentBtn}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <div className={styles.addContentType}>
                      <span className={styles.addContentTypeLabel}>
                        {selectedType}
                      </span>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={styles.chevronIcon}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {selectedTab === "exportar" && (
            hasExportableContent() ? (
              <CourseExportManager 
                courseId={courseId}
                activityId={getFirstExportableActivity()?.id || null}
                fileType={getFirstExportableActivity()?.format || null}
                courseName={courseStructure?.name || 'Curso'}
              />
            ) : (
              <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
                <h3>No hay contenido para exportar</h3>
                <p>Genera contenido en las actividades para poder exportar el curso.</p>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseSectionActivity;
