import React from "react";
import styles from "./StepCourseMaterialType.module.css";

const options = [
  { key: "videos", label: "Vídeos" },
  { key: "ppt", label: "PPT" },
  { key: "audios", label: "Audios" },
  {
    key: "archivos",
    label: (
      <>
        Archivos de texto{" "}
        <span style={{ color: "#888", fontWeight: 400 }}>
          (word, excel, pdf, txt)
        </span>
      </>
    ),
  },
];

export const StepCourseMaterialType = ({ formData, onChange }) => {
  const selected = Array.isArray(formData.courseMaterialType)
    ? formData.courseMaterialType
    : [];

  const handleSelect = (type) => {
    let newSelected;
    if (selected.includes(type)) {
      newSelected = selected.filter((item) => item !== type);
    } else {
      newSelected = [...selected, type];
    }
    onChange({ courseMaterialType: newSelected });
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
        {options.map((opt) => (
          <label key={opt.key} className={styles.optionRow}>
            <input
              type="checkbox"
              name="courseMaterialType"
              value={opt.key}
              checked={selected.includes(opt.key)}
              onChange={() => handleSelect(opt.key)}
            />
            <span className={styles.optionLabel}>{opt.label}</span>
          </label>
        ))}
      </div>
      <div className={styles.creditCount}>
        Numero de créditos a utilizar: {creditCount}
      </div>
    </div>
  );
};
