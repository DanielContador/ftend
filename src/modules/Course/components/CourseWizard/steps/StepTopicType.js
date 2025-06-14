import React from "react";
import styles from "./StepTopicType.module.css";

export const StepTopicType = ({
  flow,
  handleStepFormData,
  handleStepFlowData,
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    const fieldName = e.target.name;

    handleStepFlowData({
      topicType: {
        ...flow.topicType,
        value: e.target.value,
        formkeys: ["courseObjective", "estimatedTime", "participantProfile"],
        [fieldName]: newValue,
      },
    });

    handleStepFormData((prevForm) => ({
      ...prevForm,
      [fieldName]: newValue,
    }));
  };

  return (
    <div className={styles.stepTopicType}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Objetivo del curso</label>
        <input
          className={styles.input}
          type="text"
          name="courseObjective"
          placeholder="Ej: Capacitar a un equipo de una empresa para cumplir con la normativa"
          value={flow?.topicType?.courseObjective || ""}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Tiempo estimado de dedicación para el alumno
        </label>
        <input
          className={styles.input}
          type="text"
          name="estimatedTime"
          placeholder="Ej: 5 horas"
          value={flow?.topicType?.estimatedTime || ""}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Perfil del alumno</label>
        <input
          className={styles.input}
          type="text"
          name="participantProfile"
          placeholder="Ej: Ingeniero comercial de una empresa de capacitación"
          value={flow?.topicType?.participantProfile || ""}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
