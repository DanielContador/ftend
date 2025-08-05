import React, { useState } from "react";
import styles from "./StepEvaluationType.module.css";

const options = [
  { key: "diagnostico", label: "Evaluación con diagnóstico" },
  { key: "modulo", label: "Evaluación por módulo" },
  { key: "final", label: "Evaluación final" },
];

const keyToLabel = {
  diagnostico: "Evaluacion_diagnostico",
  modulo: "Evaluacion_modulo",
  final: "Evaluacion_final",
};

export const StepEvaluationType = ({
  flow,
  handleStepFormData,
  handleStepFlowData,
}) => {
  const [selected, setSelected] = useState(flow?.evaluationType?.value ?? null);

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
        evaluationType: {
          value: newSelected,
          formkeys: ["evaluationMethods"],
        },
      });
      // Update handleStepFormData to include selected keys and type
      const updatedResourceTypes = newSelected.split(",");
      const stringsList = updatedResourceTypes.map(
        (key) => keyToLabel[key] || key
      );
      const result = stringsList.join(",");
      handleStepFormData({ evaluationMethods: result });
    } else {
      setSelected(selected ? selected + "," + type : type);
      handleStepFlowData({
        evaluationType: {
          value: selected ? selected + "," + type : type,
          formkeys: ["evaluationMethods"],
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
      handleStepFormData({ evaluationMethods: result });
    }
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
              checked={selected?.includes(opt.key)}
              onChange={() => handleSelect(opt.key)}
            />
            <span className={styles.optionLabel}>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
