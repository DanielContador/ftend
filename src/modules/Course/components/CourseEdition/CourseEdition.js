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
        duration: "3 minutos",
      },
    ],
  },
];

const CourseEdition = ({ courseData }) => {
  const [modules, setModules] = useState(null);

  useEffect(() => {
    console.log("crud");
    console.log(courseData);
    setModules(tempData);
    // fetch("/api/modules")
    //   .then((res) => res.json())
    //   .then((data) => setModules(data));
  }, []);

  return (
    <>
      {modules != null && (
        <main className={styles.main}>
          <h2>Editar la estructura del curso</h2>
          <p>
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

          <section className={styles.courseDescription}>
            {modules.map((module) => (
              <div key={module.id} className={styles.module}>
                <h3>
                  Descripción del curso: Fundamentos de la Ley Karin en Chile
                </h3>
                <p>Ampliar o modificar los módulos a continuación:</p>
                <h4>{module.title}</h4>
                <ul>
                  {module.resources.map((res) => (
                    <li key={res.id}>
                      <span>
                        {res.type === "Video" && "📹 "}
                        {res.type === "PDF" && "📄 "}
                        {res.type === "Audio" && "🎧 "}
                        {res.name}
                      </span>
                      <span className={styles.resourceInfo}>
                        {res.type} • {res.duration}
                      </span>
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
          </section>
        </main>
      )}
    </>
  );
};

export default CourseEdition;
