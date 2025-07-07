import React, { useEffect, useState } from "react";
import styles from "./StepCourseGeneration.module.css";

export const StepCourseGeneration = ({ formData, handleFormSubmit, flow }) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Imprime toda la info del formulario al llegar a este step
    console.log("FormData final:", formData);

    handleFormSubmit(formData, flow)
      .then(() => {
        // Simula un tiempo de espera para la generación del curso
        setTimeout(() => {
          setDone(true);
        }, 3000); // Adjust the time as necessary
      })
      .catch((error) => {
        console.error("Error al generar el curso:", error);
        // Aquí podrías manejar el error, mostrar un mensaje, etc.
      });
  }, [formData]);

  // Determina el texto según el tipo de recurso seleccionado usando flow
  const isMaterial =
    flow?.resourceType?.value === "Material" ||
    flow?.resourceType === "Material";
  const loadingText = isMaterial
    ? "Solo un poco más....estamos generando tu material..."
    : "Solo un poco más....estamos generando tu curso...";

  return (
    <div className={styles.stepCourseGeneration}>
      <div className={styles.message}>{loadingText}</div>
      <div className={styles.loaderContainer}>
        <span className={styles.loader}></span>
      </div>
    </div>
  );
};
