import React, { useState } from "react";
import styles from "./CourseSectionActivity.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFolderOpen,
  faDownload,
  faWandMagicSparkles,
  faPen,
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

  const selectedModule =
    modules.find((mod) => mod.id === selectedModuleId) || modules[0];

  const handleCardToggle = (resourceId) => {
    setExpandedResource((prev) => (prev === resourceId ? null : resourceId));
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
          {selectedTab === "estructura" && (
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
                        <div className={styles.resourceCardHeader}>
                          <div className={styles.resourceCardTitle}>
                            {iconByType[res.format] || (
                              <FontAwesomeIcon
                                className={styles.iconPPT}
                                icon={faFilePowerpoint}
                              />
                            )}
                            <span className={styles.resourceTitleText}>
                              {res.object_title}
                            </span>
                            <FontAwesomeIcon
                              icon={faPen}
                              className={styles.editIcon}
                              title="Editar"
                              onClick={(e) => e.stopPropagation()}
                            />
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
                            <FontAwesomeIcon
                              icon={expanded ? faChevronUp : faChevronDown}
                              className={styles.expandIcon}
                              style={{
                                marginLeft: 16,
                                color: "#bdbdbd",
                                fontSize: 18,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardToggle(res.id);
                              }}
                            />
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
                                  <span className={styles.resourceDetailLabel}>
                                    Formato:
                                  </span>{" "}
                                  {res.format}
                                </div>
                              )}
                              {res.content && Array.isArray(res.content) && (
                                <>
                                  <div className={styles.resourceDetail}>
                                    <span
                                      className={styles.resourceDetailLabel}
                                    >
                                      Resumen de contenido:
                                    </span>
                                  </div>
                                  <ul className={styles.resourceSummaryList}>
                                    {res.content.map((item, idx) => (
                                      <li
                                        key={idx}
                                        className={styles.resourceSummaryItem}
                                      >
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}
                            </>
                          ) : (
                            res.format && (
                              <div className={styles.resourceDetail}>
                                <span className={styles.resourceDetailLabel}>
                                  Formato:
                                </span>{" "}
                                {res.format}
                              </div>
                            )
                          )}
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
          {selectedTab === "contenido" && (
            <div style={{ padding: "2rem", color: "#888" }}>
              <h3>Creación de contenido</h3>
              <p>Aquí irá la funcionalidad para crear contenido.</p>
            </div>
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
