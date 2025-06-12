import React from "react";
import styles from "./StepRequestEvaluation.module.css";

export const StepRequestEvaluation = ({ formData, onChange }) => {
  const selected = formData.evaluationType || "";

  const handleSelect = (type) => {
    onChange({ evaluationType: type });
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
            selected === "add" ? styles.selected : ""
          }`}
          onClick={() => handleSelect("add")}
        >
          Agregar evaluación <span className={styles.plus}>+</span>
        </button>
        <button
          type="button"
          className={`${styles.optionBtn} ${
            selected === "noadd" ? styles.selected : ""
          }`}
          onClick={() => handleSelect("noadd")}
        >
          No agregar evaluación
        </button>
      </div>
    </div>
  );
};
