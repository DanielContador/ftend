import React from "react";
import styles from "./StepResourceType.module.css";

export const StepResourceType = ({
  formData,
  onChange,
  handleNextDisabled,
}) => {
  // Asegúrate de que el valor sea null si no hay selección, no string vacío
  const selected = formData.resourceType ?? null;

  const handleSelect = (type) => {
    handleNextDisabled(false);
    onChange({ resourceType: type });
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
            selected === "curso" ? styles.selected : ""
          }`}
          tabIndex={0}
          role="button"
          aria-pressed={selected === "curso"}
          onClick={() => handleSelect("curso")}
          onKeyDown={(e) => handleKeyDown(e, "curso")}
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
          tabIndex={0}
          role="button"
          aria-pressed={selected === "material"}
          onClick={() => handleSelect("material")}
          onKeyDown={(e) => handleKeyDown(e, "material")}
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
