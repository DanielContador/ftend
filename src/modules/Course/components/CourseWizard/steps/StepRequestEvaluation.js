import React from "react";
import styles from "./StepRequestEvaluation.module.css";

export const StepRequestEvaluation = ({ formData, onChange }) => {
  // Nuevo: usar un booleano en vez de string
  const selected =
    typeof formData.evaluationRequested === "boolean"
      ? formData.evaluationRequested
      : null;

  const handleSelect = (value) => {
    onChange({ evaluationRequested: value });
  };

  return (
    <div className={styles.stepRequestEvaluation}>
      <h2 className={styles.question}>
        ¿Quieres agregar una evaluación a tu curso?
      </h2>
      <div className={styles.options}>
        <button
          type="button"
          className={`${styles.optionBtn} ${
            selected === true ? styles.selected : ""
          }`}
          onClick={() => handleSelect(true)}
        >
          Agregar evaluación <span className={styles.plus}>+</span>
        </button>
        <button
          type="button"
          className={`${styles.optionBtn} ${
            selected === false ? styles.selected : ""
          }`}
          onClick={() => handleSelect(false)}
        >
          No agregar evaluación
        </button>
      </div>
    </div>
  );
};
