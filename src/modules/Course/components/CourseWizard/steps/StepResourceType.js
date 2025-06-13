import React from "react";
import styles from "./StepResourceType.module.css";

export const StepResourceType = ({ formData, onChange }) => {
  // Usa courseType como key en formData
  const selected = formData.courseType ?? null;

  const handleSelect = (type) => {
    onChange({ courseType: type });
  };

  const handleKeyDown = (e, type) => {
    if (e.key === "Enter" || e.key === " ") {
      handleSelect(type);
    }
  };

  return (
    <div className={styles.stepResourceType}>
      <h2 className={styles.question}>¿Qué te gustaría crear?</h2>
      <div className={styles.options}>
        <div
          className={`${styles.optionCard} ${
            selected === "Curso" ? styles.selected : ""
          }`}
          tabIndex={0}
          role="button"
          aria-pressed={selected === "Curso"}
          onClick={() => handleSelect("Curso")}
          onKeyDown={(e) => handleKeyDown(e, "Curso")}
        >
          <div className={styles.iconCurso} />
          <div>
            <strong>Curso</strong>
            <div>
              Ideal para crear cursos rápidos, interactivos y personalizados
              fácilmente.
            </div>
          </div>
        </div>
        <div
          className={`${styles.optionCard} ${
            selected === "Material" ? styles.selected : ""
          }`}
          tabIndex={0}
          role="button"
          aria-pressed={selected === "Material"}
          onClick={() => handleSelect("Material")}
          onKeyDown={(e) => handleKeyDown(e, "Material")}
        >
          <div className={styles.iconMaterial} />
          <div>
            <strong>Material de apoyo</strong>
            <div>
              Generar contenido individual, ideal para crear contenido rápido,
              interactivo y visualmente atractivo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
