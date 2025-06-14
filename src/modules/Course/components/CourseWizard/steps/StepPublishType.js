import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faBookOpen,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./StepPublishType.module.css";

const options = [
  {
    key: "scorm",
    label: "Scorm",
    icon: <FontAwesomeIcon className={styles.customIcon} icon={faWifi} />,
    description:
      "Estandariza cursos e-learning para integrarse fácilmente a cualquier LMS compatible",
  },
  {
    key: "material", // Cambiado de "independiente" a "internet"
    label: "Recurso independiente",
    icon: <FontAwesomeIcon className={styles.customIcon} icon={faBookOpen} />,
    description:
      "Material autónomo que se usa sin depender de otros contenidos.",
  },
  {
    key: "standard",
    label: "Moodle",
    icon: (
      <FontAwesomeIcon className={styles.customIcon} icon={faGraduationCap} />
    ),
    description:
      "Archivo con estructura, diseño, que organiza contenido dentro de cursos Moodle",
  },
];

export const StepPublishType = ({
  flow,
  handleStepFormData,
  handleStepFlowData,
}) => {
  // Cambia publishType por courseGenerationType
  const [selected, setSelected] = useState(flow?.publishType?.value ?? null);

  const handleSelect = (type) => {
    handleStepFormData({ courseType: type });
    //update the flow
    handleStepFlowData({
      publishType: { value: type, formkeys: ["courseType"] },
    });
    setSelected(type);
  };

  const handleKeyDown = (e, type) => {
    if (e.key === "Enter" || e.key === " ") {
      handleSelect(type);
    }
  };

  return (
    <div className={styles.stepPublishType}>
      <h2 className={styles.question}>¿Cómo quieres publicar el curso?</h2>
      <div className={styles.options}>
        {options.map((opt) => (
          <div
            key={opt.key}
            className={`${styles.optionCard} ${
              selected === opt.key ? styles.selected : ""
            }`}
            tabIndex={0}
            role="button"
            aria-pressed={selected === opt.key}
            onClick={() => handleSelect(opt.key)}
            onKeyDown={(e) => handleKeyDown(e, opt.key)}
          >
            <div className={styles.roundBackground}>{opt.icon}</div>
            <div>
              <strong>{opt.label}</strong>
              <div>{opt.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
