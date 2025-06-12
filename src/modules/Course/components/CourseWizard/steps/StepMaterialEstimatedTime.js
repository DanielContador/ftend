import React from "react";
import styles from "./StepMaterialEstimatedTime.module.css";

export const StepMaterialEstimatedTime = ({ formData, onChange }) => {
  const handleChange = (e) => {
    onChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.stepMaterialEstimatedTime}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Tiempo estimado de dedicación</label>
        <input
          className={styles.input}
          type="text"
          name="materialEstimatedTime"
          placeholder="Ej: 5 minutos de vídeo"
          value={formData.materialEstimatedTime || ""}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Perfil del alumno</label>
        <input
          className={styles.input}
          type="text"
          name="materialStudentProfile"
          placeholder="Ej: Usuario básico"
          value={formData.materialStudentProfile || ""}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>¿Desea agregar más contexto?</label>
        <textarea
          className={styles.textarea}
          name="materialContext"
          placeholder="Ej: El curso debe ser claro y usar un lenguaje gentil y cordial para tratar temas sensibles para la Ley Karin, el contenido debe guiarse principalmente por el documento subido anteriormente."
          value={formData.materialContext || ""}
          onChange={handleChange}
          rows={4}
        />
      </div>
    </div>
  );
};
