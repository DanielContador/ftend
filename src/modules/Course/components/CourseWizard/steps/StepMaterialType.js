import React from "react";
import styles from "./StepMaterialType.module.css";

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

export const StepMaterialType = ({ formData, onChange }) => {
  const selected = formData.materialType || "";

  const handleSelect = (type) => {
    onChange({ materialType: type });
  };

  return (
    <div className={styles.stepMaterialType}>
      <h2 className={styles.question}>¿Qué tipo de material quieres crear?</h2>
      <div className={styles.optionsBox}>
        {options.map((opt) => (
          <label key={opt.key} className={styles.optionRow}>
            <input
              type="radio"
              name="materialType"
              value={opt.key}
              checked={selected === opt.key}
              onChange={() => handleSelect(opt.key)}
            />
            <span className={styles.optionLabel}>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
