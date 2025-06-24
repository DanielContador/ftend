import React, { useState } from "react";
import styles from "./CourseEdition.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlay,
  faFilePdf,
  faHeadphones,
  faFilePowerpoint,
  faPencil,
  faTrash,
  faArrowsRotate,
  faFile,
  faFloppyDisk,
  faXmark,
  faCirclePlus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

// Mapea el formato del backend a los iconos y badges
const iconByType = {
  Video: <FontAwesomeIcon className={styles.iconVideo} icon={faCirclePlay} />,
  PDF: <FontAwesomeIcon className={styles.iconPDF} icon={faFilePdf} />,
  Audio: <FontAwesomeIcon className={styles.iconAudio} icon={faHeadphones} />,
  PPT: <FontAwesomeIcon className={styles.iconPPT} icon={faFilePowerpoint} />,
};

const badgeClassByType = {
  Video: styles.badgeVideo,
  PDF: styles.badgePDF,
  Audio: styles.badgeAudio,
  PPT: styles.badgePPT,
};

const formatLabel = (format) => {
  if (format === "PPT") return "PPT";
  if (format === "PDF") return "PDF";
  if (format === "Video") return "Video";
  if (format === "Audio") return "Audio";
  return format;
};

const CourseEdition = ({
  courseStructure,
  handleError,
  courseId,
  handleRegenerate,
  handleUpdateActivityTitle,
}) => {
  const modules = courseStructure?.modules || [];
  const [editInput, setEditInput] = useState("");
  // Estado para edición de recursos: { [objectId]: { editing: bool, value: string, original: string } }
  const [editingResource, setEditingResource] = useState({});

  // Maneja el input de IA para reestructurar
  const handleInputChange = (e) => {
    setEditInput(e.target.value);
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
    console.log(moduleId, objectId);
    const newTitle = editingResource[objectId]?.value;
    if (newTitle && newTitle.trim() !== "") {
      handleUpdateActivityTitle(newTitle, objectId); // Llama a la función para actualizar el título en el backend
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

  const handleRegenerateClick = () => {
    if (editInput.trim() === "") {
      handleError(
        "Por favor, ingresa instrucciones para reestructurar el curso."
      );
      return;
    }
    handleRegenerate(editInput, courseId);
    setEditInput(""); // Limpiar input después de regenerar
  };

  return (
    <>
      <main className={styles.main}>
        <div>
          <h2 className={styles.pageTitle}>Editar la estructura del curso</h2>
          <p className={styles.pageSubtitle}>
            Usa las herramientas de IA para reordenar o modificar los módulos
            del curso según tus necesidades.
          </p>
          <section className={styles.editSection}>
            <h4 className={styles.title}>Modificar estructura del curso</h4>
            <div className={styles.aiBox}>
              <input
                className={styles.input}
                placeholder="Describe cómo quieres reestructurar tu curso..."
                value={editInput}
                onChange={handleInputChange}
              />
              <button
                className={styles.generateButton}
                style={{ opacity: editInput.trim() === "" ? 0.5 : 1 }}
                disabled={editInput.trim() === ""}
                onClick={handleRegenerateClick}
              >
                <FontAwesomeIcon className="me-2" icon={faArrowsRotate} />
                Regenerar estructura
              </button>
            </div>
          </section>
        </div>

        <div className={styles.courseDescription}>
          <h3 className={styles.courseDescTitle}>
            Descripción del curso:{" "}
            <span className={styles.courseDescTitleStrong}>
              {courseStructure?.course_title}
            </span>
          </h3>
          <p className={styles.courseDescSubtitle}>
            Ampliar o modificar los módulos a continuación:
          </p>
          {modules.map((module, index = 1) => (
            <div key={module.id} className={styles.module}>
              <div className={styles.moduleHeader}>
                <h4 className={styles.moduleTitle}>
                  <span className={styles.moduleTitleBar} />
                  Módulo {++index}: {module.module_title}
                </h4>
                <button
                  className={styles.moduleOptionsBtn}
                  title="Más opciones"
                >
                  ⋮
                </button>
              </div>
              <ul className={styles.moduleList}>
                {Array.isArray(module.learning_objects) &&
                  module.learning_objects.map((res) => {
                    const isEditing = editingResource[res.id]?.editing;
                    const editValue =
                      editingResource[res.id]?.value ?? res.object_title;
                    return (
                      <li key={res.id} className={styles.moduleListItem}>
                        {iconByType[res.format] || (
                          <FontAwesomeIcon
                            className={styles.iconFile}
                            icon={faFile}
                          />
                        )}
                        <div className={styles.resourceInfoBox}>
                          <div className={styles.resourceName}>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) =>
                                  handleResourceTitleChange(res.id, e)
                                }
                                className={styles.input}
                                style={{
                                  fontWeight: 500,
                                  fontSize: "1.05rem",
                                  padding: "4px 8px",
                                  minWidth: 320,
                                  maxWidth: 600,
                                  width: "100%",
                                }}
                                autoFocus
                              />
                            ) : (
                              res.object_title
                            )}
                          </div>
                          <div className={styles.resourceBadgeRow}>
                            <span
                              className={
                                badgeClassByType[res.format] || styles.badgePPT
                              }
                            >
                              {formatLabel(res.format)}
                            </span>
                            <span className={styles.resourceDuration}>
                              {res.estimated_time
                                ? `${res.estimated_time} minutos`
                                : ""}
                            </span>
                          </div>
                        </div>
                        {isEditing ? (
                          <>
                            <button
                              className={styles.editBtn}
                              title="Guardar"
                              onClick={() => handleSaveClick(module.id, res.id)}
                            >
                              <FontAwesomeIcon icon={faFloppyDisk} />
                            </button>
                            <button
                              className={styles.deleteBtn}
                              title="Cancelar"
                              onClick={() => handleCancelClick(res.id)}
                            >
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={styles.editBtn}
                              title="Editar"
                              onClick={() =>
                                handleEditClick(res.id, res.object_title)
                              }
                            >
                              <FontAwesomeIcon icon={faPencil} />
                            </button>
                            <button
                              className={styles.deleteBtn}
                              title="Eliminar"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </>
                        )}
                      </li>
                    );
                  })}
              </ul>
              <button className={styles.addResource}>
                <FontAwesomeIcon icon={faPlus} />
                <span className={styles.addResourceText}>Agregar recurso</span>
              </button>
            </div>
          ))}
          <div className={styles.addModule}>
            <button>
              <FontAwesomeIcon
                className={styles.addModuleIcon}
                icon={faCirclePlus}
              />
              <span className={styles.addModuleText}>Agregar nuevo módulo</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default CourseEdition;
