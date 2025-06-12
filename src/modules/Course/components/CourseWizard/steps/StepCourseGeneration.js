import React, { useEffect, useState } from "react";
import styles from "./StepCourseGeneration.module.css";

export const StepCourseGeneration = ({ formData }) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Imprime toda la info del formulario al llegar a este step
    console.log("FormData final:", formData);

    const timer = setTimeout(() => {
      setDone(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [formData]);

  if (done) {
    return (
      <div className={styles.stepCourseGeneration}>
        <div className={styles.successMessage}>
          ¡Curso generado exitosamente!
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stepCourseGeneration}>
      <div className={styles.message}>
        Solo un poco más....estamos generando tu curso...
      </div>
      <div className={styles.loaderContainer}>
        <span className={styles.loader}></span>
      </div>
    </div>
  );
};
