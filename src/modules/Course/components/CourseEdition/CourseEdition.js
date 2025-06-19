import React, { useState, useEffect } from "react";
import styles from "./CourseEdition.module.css";

const tempData = [
  {
    id: 1,
    title: "Módulo 1: Introducción a la Ley Karin",
    resources: [
      {
        id: 1,
        name: "Video de bienvenida",
        type: "Video",
        duration: "3 minutos",
      },
      {
        id: 2,
        name: "Guía PDF introductoria",
        type: "PDF",
        duration: "5 páginas",
      },
      {
        id: 3,
        name: "Audio descriptivo",
        type: "Audio",
        duration: "7 minutos",
      },
    ],
  },
  {
    id: 2,
    title: "Módulo 2: Fundamentos básicos sobre la ley",
    resources: [
      {
        id: 4,
        name: "Fundamentos básicos",
        type: "Video",
        duration: "2 minutos",
      },
    ],
  },
];

const iconByType = {
  Video: <span className={styles.iconVideo}>🎥</span>,
  PDF: <span className={styles.iconPDF}>📄</span>,
  Audio: <span className={styles.iconAudio}>🎧</span>,
};

const badgeClassByType = {
  Video: styles.badgeVideo,
  PDF: styles.badgePDF,
  Audio: styles.badgeAudio,
};

const CourseEdition = ({ courseData, courseStructure }) => {
  const [modules, setModules] = useState(null);

  useEffect(() => {
    console.log("courseData", courseData);
    console.log("courseStructure", courseStructure);
    setModules(tempData);
  }, []);

  return (
    <>
      {modules != null && (
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
                  🔁 Regenerar estructura
                </button>
              </div>
            </section>
          </div>

          <div className={styles.courseDescription}>
            <h3 className={styles.courseDescTitle}>
              Descripción del curso:{" "}
              <span className={styles.courseDescTitleStrong}>
                {courseStructure.course_title}
              </span>
            </h3>
            <p className={styles.courseDescSubtitle}>
              Ampliar o modificar los módulos a continuación:
            </p>
            {courseStructure.modules.map((module) => (
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
                  {module.learning_objects.map((res) => (
                    <li key={res.id} className={styles.moduleListItem}>
                      {iconByType[res.format]}
                      <div className={styles.resourceInfoBox}>
                        <div className={styles.resourceName}>
                          {res.object_title}
                        </div>
                        <div className={styles.resourceBadgeRow}>
                          <span className={badgeClassByType[res.type]}>
                            {res.format}
                          </span>
                          <span className={styles.resourceDuration}>
                            {res.estimated_time}
                          </span>
                        </div>
                      </div>
                      <button className={styles.editBtn} title="Editar">
                        <span role="img" aria-label="edit">
                          ✏️
                        </span>
                      </button>
                      <button className={styles.deleteBtn} title="Eliminar">
                        <span role="img" aria-label="delete">
                          🗑️
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button className={styles.addResource}>
                  + Agregar recurso
                </button>
              </div>
            ))}
            <div className={styles.addModule}>
              <button>+ Agregar nuevo módulo</button>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default CourseEdition;
