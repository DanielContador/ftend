import React from "react";
import styles from "./StepCourseMaterialType.module.css";

// Map keys to backend labels
const keyToLabel = {
  videos: "Video",
  ppt: "PPT",
  audios: "Audio",
  archivos: "Archivos de texto (Word, Excel, txt y PDF)",
  scormslide: "HTML5 (diapositivas interactivas)",
};

export const StepCourseMaterialType = ({ formData, onChange }) => {
  // resourceTypes es un string separado por comas
  const selected =
    typeof formData.resourceTypes === "string" && formData.resourceTypes
      ? formData.resourceTypes.split(",").map((s) => s.trim())
      : [];

  // Opciones base
  const baseOptions = [
    { key: "videos", label: "Vídeos" },
    { key: "ppt", label: "PPT" },
    { key: "audios", label: "Audios" },
  ];

  // Opción condicional para la cuarta opción
  const lastOption =
    formData.courseGenerationType === "scorm"
      ? {
          key: "scormslide",
          label: "Diapositiva con Texto de Scorm",
        }
      : {
          key: "archivos",
          label: "Archivos de texto (word, excel, pdf, txt)",
        };

  const options = [...baseOptions, lastOption];

  const handleSelect = (type) => {
    const label = keyToLabel[type] || type;
    let newSelected;
    if (selected.includes(label)) {
      newSelected = selected.filter((item) => item !== label);
    } else {
      newSelected = [...selected, label];
    }
    const resourceTypesString = newSelected.join(", ");
    onChange({ resourceTypes: resourceTypesString });
  };

  // El número de créditos a utilizar vendrá de una variable futura, aquí solo muestra el valor si existe
  const creditCount =
    typeof formData.creditsToUse === "number" ? formData.creditsToUse : 0;

  return (
    <div className={styles.stepCourseMaterialType}>
      <h2 className={styles.question}>
        Selecciona el tipo de material que quieres generar para el curso
      </h2>
      <div className={styles.optionsBox}>
        {options.map((opt) => {
          const labelString = keyToLabel[opt.key] || opt.label;
          const isChecked = selected.includes(labelString);
          return (
            <label key={opt.key} className={styles.optionRow}>
              <input
                type="checkbox"
                name="resourceTypes"
                value={opt.key}
                checked={isChecked}
                onChange={() => handleSelect(opt.key)}
              />
              <span className={styles.optionLabel}>
                {typeof opt.label === "string" ? opt.label : labelString}
              </span>
            </label>
          );
        })}
      </div>
      <div className={styles.creditCount}>
        Numero de créditos a utilizar: {creditCount}
      </div>
    </div>
  );
};
