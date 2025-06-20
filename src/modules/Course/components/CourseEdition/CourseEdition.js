import React, { useState, useEffect } from "react";
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

const CourseEdition = ({ courseStructure }) => {
  const modules = courseStructure?.modules || [];

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
              />
              <button className={styles.generateButton}>
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
          {modules.map((module) => (
            <div key={module.id} className={styles.module}>
              <div className={styles.moduleHeader}>
                <h4 className={styles.moduleTitle}>
                  <span className={styles.moduleTitleBar} />
                  {module.module_title}
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
                  module.learning_objects.map((res) => (
                    <li key={res.id} className={styles.moduleListItem}>
                      {iconByType[res.format] || (
                        <FontAwesomeIcon
                          className={styles.iconFile}
                          icon={faFile}
                        />
                      )}
                      <div className={styles.resourceInfoBox}>
                        <div className={styles.resourceName}>
                          {res.object_title}
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
                      <button className={styles.editBtn} title="Editar">
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                      <button className={styles.deleteBtn} title="Eliminar">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </li>
                  ))}
              </ul>
              <button className={styles.addResource}>+ Agregar recurso</button>
            </div>
          ))}
          <div className={styles.addModule}>
            <button>
              <span className={styles.addModuleIcon}>+</span>
              <span className={styles.addModuleText}>Agregar nuevo módulo</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default CourseEdition;
