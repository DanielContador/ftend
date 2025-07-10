import React, { useRef, useState } from "react";
import styles from "./UploadDocumentPopup.module.css";

const UploadDocumentPopup = ({ isOpen, onClose, onUpload, title, message }) => {
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file ? file.name : "");
    onUpload(file);
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset for same file selection
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className={styles.fileInputRow}>
          <button
            type="button"
            className={styles.uploadPopupButton}
            onClick={handleBrowseClick}
          >
            Examinar...
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <span className={styles.selectedFileName}>
            {selectedFileName || "No se ha seleccionado ningún archivo."}
          </span>
        </div>
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelButton}>
            <span style={{ width: "100%", textAlign: "center" }}>Cerrar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentPopup;
