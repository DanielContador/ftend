import React, { useRef } from "react";
import styles from "./StepThemeType.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
// Asegúrate de tener FontAwesome importado globalmente o en tu layout

export const StepThemeType = ({
  flow,
  handleStepFormData,
  handleStepFlowData,
}) => {
  const fileInputRef = useRef();

  const handleInputChange = (e) => {
    handleStepFormData({
      courseName: e.target.value,
      courseGenerationType: "Internet",
    });
    handleStepFlowData({
      themeType: {
        value: e.target.value,
        formkeys: ["courseName", "files", "courseGenerationType"],
      },
    });
  };

  const handleFileChange = (e) => {
    handleStepFormData({
      courseName: flow?.themeType?.value || "",
      courseGenerationType: "Documents",
      files: Array.from(e.target.files),
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleStepFormData({
      courseName: flow?.themeType?.value || "",
      courseGenerationType: "Documents",
      files: Array.from(e.dataTransfer.files),
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.stepThemeType}>
      <h2 className={styles.question}>Ingresa el tipo de temática del curso</h2>
      <input
        className={styles.input}
        type="text"
        placeholder="Ej: Fundamentos sobre la Ley Karin en Chile"
        value={flow?.themeType?.value || ""}
        onChange={handleInputChange}
      />
      <div
        className={styles.uploadBox}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <div className={styles.uploadIcon}>
          <FontAwesomeIcon icon={faArrowUpFromBracket} />
        </div>
        <div className={styles.uploadTitle}>
          Carga documentos para mayor efectividad
        </div>
        <div className={styles.uploadDesc}>
          Arrastra y suelta archivos o haz clic aquí
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
