import React, { useRef } from "react";
import styles from "./StepThemeMaterialType.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";

export const StepThemeMaterialType = ({ formData, onChange }) => {
  const fileInputRef = useRef();

  const handleInputChange = (e) => {
    onChange({ themeMaterial: e.target.value });
  };

  const handleFileChange = (e) => {
    onChange({ themeMaterialFiles: Array.from(e.target.files) });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onChange({ themeMaterialFiles: Array.from(e.dataTransfer.files) });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.stepThemeMaterialType}>
      <h2 className={styles.question}>
        Ingresa la temática del material que se quiere generar
      </h2>
      <input
        className={styles.input}
        type="text"
        placeholder="Ej: Fundamentos sobre la Ley Karin en Chile"
        value={formData.themeMaterial || ""}
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
