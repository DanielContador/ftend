import React from "react";
import styles from "./StepEvaluationType.module.css";

const options = [
  { key: "diagnostico", label: "Evaluación con diagnóstico" },
  { key: "modulo", label: "Evaluación por módulo" },
  { key: "final", label: "Evaluación final" },
];

export const StepEvaluationType = ({ formData, onChange }) => {
  const selected = formData.evaluationTypeList || [];

  const handleSelect = (key) => {
    let newSelected;
    if (selected.includes(key)) {
      newSelected = selected.filter((item) => item !== key);
    } else {
      newSelected = [...selected, key];
    }
    onChange({ evaluationTypeList: newSelected });
  };

  return (
    <div className={styles.stepEvaluationType}>
      <h2 className={styles.question}>
        Elige el tipo de evaluación que deseas crear
      </h2>
      <div className={styles.optionsBox}>
        {options.map((opt) => (
          <label key={opt.key} className={styles.optionRow}>
            <input
              type="checkbox"
              name="evaluationTypeList"
              value={opt.key}
              checked={selected.includes(opt.key)}
              onChange={() => handleSelect(opt.key)}
            />
            <span className={styles.optionLabel}>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
