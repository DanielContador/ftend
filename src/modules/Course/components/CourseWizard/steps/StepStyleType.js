import React from "react";
import styles from "./StepStyleType.module.css";

export const StepStyleType = ({ formData, onChange }) => {
  const handleChange = (e) => {
    onChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.stepStyleType}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Tono y estilo del curso</label>
        <input
          className={styles.input}
          type="text"
          name="toneStyle"
          placeholder="Ej: Cercano y simple para el alumno"
          value={formData.toneStyle || ""}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>¿Desea agregar más contexto?</label>
        <textarea
          className={styles.textarea}
          name="additionalContext"
          placeholder="Ej: El curso debe ser claro y usar un lenguaje gentil y cordial para tratar temas sensibles para la Ley Karin, el contenido debe guiarse principalmente por el documento subido anteriormente."
          value={formData.additionalContext || ""}
          onChange={handleChange}
          rows={4}
        />
      </div>
    </div>
  );
};
