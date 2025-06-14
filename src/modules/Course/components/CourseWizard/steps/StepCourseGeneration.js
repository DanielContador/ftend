import React, { useEffect, useState } from "react";
import styles from "./StepCourseGeneration.module.css";

export const StepCourseGeneration = ({ formData, handleFormSubmit }) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Imprime toda la info del formulario al llegar a este step
    console.log("FormData final:", formData);

    // handleFormSubmit(formData)
    //   .then(() => {
    //     // Simula un tiempo de espera para la generación del curso
    //     setTimeout(() => {
    //       setDone(true);
    //     }, 3000); // Ajusta el tiempo según sea necesario
    //   })
    //   .catch((error) => {
    //     console.error("Error al generar el curso:", error);
    //     // Aquí podrías manejar el error, mostrar un mensaje, etc.
    //   });
  }, [formData]);

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
