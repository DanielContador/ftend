import React from "react";
import styles from "./StepTopicType.module.css";

export const StepTopicType = ({ formData, onChange }) => {
  const handleChange = (e) => {
    onChange({ [e.target.name]: e.target.value });
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
          value={formData.courseObjective || ""}
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
          name="courseTime"
          placeholder="Ej: Capacitar a un equipo de una empresa para cumplir con la normativa"
          value={formData.courseTime || ""}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Perfil del alumno</label>
        <input
          className={styles.input}
          type="text"
          name="studentProfile"
          placeholder="Ej: Ingeniero comercial de una empresa de capacitación"
          value={formData.studentProfile || ""}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
