import React from "react";
import styles from "./StepMaterialEstimatedTime.module.css";

export const StepMaterialEstimatedTime = ({
  flow,
  handleStepFormData,
  handleStepFlowData,
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    const fieldName = e.target.name;

    handleStepFlowData({
      materialEstimatedTime: {
        ...flow.materialEstimatedTime,
        value: e.target.value,
        formkeys: ["additionalContext", "estimatedTime", "participantProfile"],
        [fieldName]: newValue,
      },
    });

    handleStepFormData((prevForm) => ({
      ...prevForm,
      [fieldName]: newValue,
    }));
  };

  return (
    <div className={styles.stepMaterialEstimatedTime}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Tiempo estimado de dedicación</label>
        <input
          className={styles.input}
          type="text"
          name="estimatedTime"
          placeholder="Ej: 5 minutos de vídeo"
          value={flow?.materialEstimatedTime?.estimatedTime || ""}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Perfil del alumno</label>
        <input
          className={styles.input}
          type="text"
          name="participantProfile"
          placeholder="Ej: Usuario básico"
          value={flow?.materialEstimatedTime?.participantProfile || ""}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>¿Desea agregar más contexto?</label>
        <textarea
          className={styles.textarea}
          name="additionalContext"
          placeholder="Ej: El curso debe ser claro y usar un lenguaje gentil y cordial para tratar temas sensibles para la Ley Karin, el contenido debe guiarse principalmente por el documento subido anteriormente."
          value={flow?.materialEstimatedTime?.additionalContext || ""}
          onChange={handleChange}
          rows={4}
        />
      </div>
    </div>
  );
};
