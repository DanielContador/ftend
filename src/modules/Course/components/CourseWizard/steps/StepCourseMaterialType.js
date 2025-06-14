import React, { useState } from "react";
import styles from "./StepCourseMaterialType.module.css";

// Map keys to backend labels
const keyToLabel = {
  videos: "Video",
  ppt: "PPT",
  audios: "Audio",
  archivos: "Archivos de texto (Word, Excel, txt y PDF)",
  scormslide: "HTML5 (diapositivas interactivas)",
};

export const StepCourseMaterialType = ({
  flow,
  handleStepFormData,
  handleStepFlowData,
}) => {
  const [selected, setSelected] = useState(
    flow?.courseMaterialType?.value ?? null
  );
  // Opciones base
  const baseOptions = [
    { key: "videos", label: "Vídeos" },
    { key: "ppt", label: "PPT" },
    { key: "audios", label: "Audios" },
  ];

  // Opción condicional para la cuarta opción
  const lastOption =
    flow?.publishType?.value === "scorm"
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
    if (selected && selected.includes(type)) {
      // If already selected, remove it
      const newSelected = selected
        .split(",")
        .filter((item) => item !== type)
        .join(",");
      setSelected(newSelected);
      // Update flow data to remove the type
      handleStepFlowData({
        courseMaterialType: {
          value: newSelected,
          formkeys: ["resourceTypes"],
        },
      });
      // Update handleStepFormData to include selected keys and type
      const updatedResourceTypes = newSelected.split(",");
      const stringsList = updatedResourceTypes.map(
        (key) => keyToLabel[key] || key
      );
      const result = stringsList.join(",");
      handleStepFormData({ resourceTypes: result });
    } else {
      setSelected(selected ? selected + "," + type : type);
      handleStepFlowData({
        courseMaterialType: {
          value: selected ? selected + "," + type : type,
          formkeys: ["resourceTypes"],
        },
      });
      // Update handleStepFormData to include selected keys and type
      const updatedResourceTypes = selected
        ? selected.split(",").concat(type)
        : [type];
      const stringsList = updatedResourceTypes.map(
        (key) => keyToLabel[key] || key
      );
      const result = stringsList.join(",");
      handleStepFormData({ resourceTypes: result });
    }
  };

  // El número de créditos a utilizar vendrá de una variable futura, aquí solo muestra el valor si existe
  const creditCount = 0;

  return (
    <div className={styles.stepCourseMaterialType}>
      <h2 className={styles.question}>
        Selecciona el tipo de material que quieres generar para el curso
      </h2>
      <div className={styles.optionsBox}>
        {options.map((opt) => {
          const isChecked = selected?.includes(opt.key);
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
