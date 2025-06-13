import React from "react";
import styles from "./StepPublishType.module.css";

const options = [
  {
    key: "scorm",
    label: "Scorm",
    icon: <span style={{ fontSize: "2rem", display: "inline-block" }}>📡</span>,
    description:
      "Estandariza cursos e-learning para integrarse fácilmente a cualquier LMS compatible",
  },
  {
    key: "internet", // Cambiado de "independiente" a "internet"
    label: "Recurso independiente",
    icon: <span style={{ fontSize: "2rem", display: "inline-block" }}>📖</span>,
    description:
      "Material autónomo que se usa sin depender de otros contenidos.",
  },
  {
    key: "moodle",
    label: "Moodle",
    icon: <span style={{ fontSize: "2rem", display: "inline-block" }}>🎓</span>,
    description:
      "Archivo con estructura, diseño, que organiza contenido dentro de cursos Moodle",
  },
];

export const StepPublishType = ({ formData, onChange }) => {
  // Cambia publishType por courseGenerationType
  const selected = formData.courseGenerationType ?? null;

  const handleSelect = (type) => {
    onChange({ courseGenerationType: type });
  };

  const handleKeyDown = (e, type) => {
    if (e.key === "Enter" || e.key === " ") {
      handleSelect(type);
    }
  };

  return (
    <div className={styles.stepPublishType}>
      <h2 className={styles.question}>¿Cómo quieres publicar el curso?</h2>
      <div className={styles.options}>
        {options.map((opt) => (
          <div
            key={opt.key}
            className={`${styles.optionCard} ${
              selected === opt.key ? styles.selected : ""
            }`}
            tabIndex={0}
            role="button"
            aria-pressed={selected === opt.key}
            onClick={() => handleSelect(opt.key)}
            onKeyDown={(e) => handleKeyDown(e, opt.key)}
          >
            <div>{opt.icon}</div>
            <div>
              <strong>{opt.label}</strong>
              <div>{opt.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
