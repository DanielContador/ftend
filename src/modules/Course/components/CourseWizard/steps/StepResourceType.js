import React from "react";
import styles from "../CourseWizard.module.css";

export const StepResourceType = ({ formData, onChange }) => {
  const selected = formData.resourceType || "";

  const handleSelect = (type) => {
    onChange({ resourceType: type });
  };

  return (
    <div className={styles.stepResourceType}>
      <h2 className={styles.question}>¿Qué te gustaría crear?</h2>
      <div className={styles.options}>
        <div
          className={`${styles.optionCard} ${
            selected === "curso" ? styles.selected : ""
          }`}
          onClick={() => handleSelect("curso")}
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
            selected === "material" ? styles.selected : ""
          }`}
          onClick={() => handleSelect("material")}
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
