import React, { useState } from "react";
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

const keyToLabel = {
  videos: "Video",
  ppt: "PPT",
  audios: "Audio",
  archivos: "Archivos de texto (Word, Excel, txt y PDF)",
};

export const StepMaterialType = ({
  flow,
  handleStepFormData,
  handleStepFlowData,
}) => {
  // El valor guardado es el label, no el key
  const [selected, setSelected] = useState(flow?.materialType?.value ?? null);

  const handleSelect = (type) => {
    const resourceTypesString = keyToLabel[type] || type;
    handleStepFormData({ resourceTypes: resourceTypesString });
    handleStepFlowData({
      materialType: { value: type, formkeys: ["resourceTypes"] },
    });
    setSelected(type);
  };

  return (
    <div className={styles.stepMaterialType}>
      <h2 className={styles.question}>¿Qué tipo de material quieres crear?</h2>
      <div className={styles.optionsBox}>
        {options.map((opt) => (
          <label key={opt.key} className={styles.optionRow}>
            <input
              type="radio"
              name="resourceTypes"
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
