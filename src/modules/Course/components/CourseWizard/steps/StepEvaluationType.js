import React from "react";
import styles from "./StepEvaluationType.module.css";

const options = [
  { key: "diagnostico", label: "Evaluación con diagnóstico" },
  { key: "modulo", label: "Evaluación por módulo" },
  { key: "final", label: "Evaluación final" },
];

const keyToLabel = {
  diagnostico: "Evaluación con diagnóstico",
  modulo: "Evaluación por módulo",
  final: "Evaluación final",
};

export const StepEvaluationType = ({ formData, onChange }) => {
  // evaluationMethods es un string separado por comas
  const selected =
    typeof formData.evaluationMethods === "string" && formData.evaluationMethods
      ? formData.evaluationMethods.split(",").map((s) => s.trim())
      : [];

  const handleSelect = (key) => {
    const label = keyToLabel[key] || key;
    let newSelected;
    if (selected.includes(label)) {
      newSelected = selected.filter((item) => item !== label);
    } else {
      newSelected = [...selected, label];
    }
    const evaluationMethodsString = newSelected.join(", ");
    onChange({ evaluationMethods: evaluationMethodsString });
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
              name="evaluationMethods"
              value={opt.key}
              checked={selected.includes(keyToLabel[opt.key] || opt.key)}
              onChange={() => handleSelect(opt.key)}
            />
            <span className={styles.optionLabel}>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
