import React, { useState } from "react";
import styles from "./CourseSectionActivity.module.css";
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
} from "@fortawesome/free-solid-svg-icons";

// Mapea el formato del backend a los iconos y colores igual que en CourseEdition
const iconByType = {
  Video: <FontAwesomeIcon className={styles.iconVideo} icon={faCirclePlay} />,
  PDF: <FontAwesomeIcon className={styles.iconPDF} icon={faFilePdf} />,
  Audio: <FontAwesomeIcon className={styles.iconAudio} icon={faHeadphones} />,
  PPT: <FontAwesomeIcon className={styles.iconPPT} icon={faFilePowerpoint} />,
};

const tabs = [
  { key: "contenido", label: "Creación de contenido" },
  { key: "evaluacion", label: "Evaluación" },
  { key: "exportar", label: "Exportar" },
];

const CourseSectionActivity = ({
  courseStructure,
  handleError,
  courseId,
  handleRegenerate,
  handleUpdateActivityTitle,
}) => {
  const modules = courseStructure?.modules || [];
  const [selectedModuleId, setSelectedModuleId] = useState(
    modules.length > 0 ? modules[0].id : null
  );
  const [selectedType, setSelectedType] = useState("PPT");
  const [contentInput, setContentInput] = useState("");
  const [expandedResource, setExpandedResource] = useState(null);
  const [selectedTab, setSelectedTab] = useState(tabs[0].key);

  // Edición de título de recurso (card)
  const [editingResource, setEditingResource] = useState({});

  const selectedModule =
    modules.find((mod) => mod.id === selectedModuleId) || modules[0];

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
                onClick={() => setSelectedModuleId(mod.id)}
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
              className={
                selectedTab === tab.key
                  ? `${styles.tabItem} ${styles.tabItemActive}`
                  : styles.tabItem
              }
              onClick={() => setSelectedTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <main className={styles.sectionMain}>
          {selectedTab === "contenido" && (
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
                        <div className="d-flex align-items-center">
                          <div>
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
                                      <FontAwesomeIcon icon={faFloppyDisk} />
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
                                    <span className={styles.resourceTitleText}>
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
                                  className={styles.downloadBtn}
                                  title="Descargar"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FontAwesomeIcon icon={faDownload} />
                                </button>
                                <button
                                  className={styles.generateBtn}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FontAwesomeIcon icon={faWandMagicSparkles} />
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
                                        className={styles.resourceDetailLabel}
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
                                            className={styles.resourceDetail}
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
                                            {parsedContent.map((item, idx) => (
                                              <li
                                                key={idx}
                                                className={
                                                  styles.resourceSummaryItem
                                                }
                                              >
                                                {item}
                                              </li>
                                            ))}
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
          {selectedTab === "evaluacion" && (
            <div style={{ padding: "2rem", color: "#888" }}>
              <h3>Evaluación</h3>
              <p>Aquí irá la funcionalidad para evaluación.</p>
            </div>
          )}
          {selectedTab === "exportar" && (
            <div style={{ padding: "2rem", color: "#888" }}>
              <h3>Exportar</h3>
              <p>Aquí irá la funcionalidad para exportar el curso.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseSectionActivity;
