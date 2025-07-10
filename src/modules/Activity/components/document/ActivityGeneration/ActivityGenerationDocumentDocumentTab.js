import React, { useRef, useState } from "react";
import styles from "./ActivityGenerationDocumentDocumentTab.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faPen,
  faSave,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import UploadDocumentPopup from "../../../../../shared/components/UploadDocumentPopup";

const DEFAULT_DOCUMENT_TEXT = `Ejemplo de documento generado por MentorIA.
Aquí aparecerá el contenido generado para tu recurso de texto (PDF, Word, etc).
Cuando generes el documento, este texto será reemplazado automáticamente.`;

const ActivityGenerationDocumentDocumentTab = ({
  documentContent,
  setDocumentContent,
  editMode,
  setEditMode,
  tempContent,
  setTempContent,
  handleSaveDocument,
  activityDocument,
  fileToken,
  data,
}) => {
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const contentRef = useRef(null);

  // URL de descarga del documento generado
  const downloadUrl =
    activityDocument && fileToken
      ? `${process.env.NEXT_PUBLIC_API_URL}/v1/download/${data.contentType}/file/${activityDocument.activityId}?token=${fileToken}`
      : "";

  // Mostrar texto por defecto si no hay documento generado
  const isEmpty = !documentContent || documentContent.trim() === "";

  // Si no hay activityDocument o no tiene id, deshabilita el botón de guardar
  const canSave =
    activityDocument &&
    activityDocument.id &&
    typeof activityDocument.id !== "undefined" &&
    activityDocument.id !== null;

  // Cuando se hace click en una imagen en modo edición
  const handleImageClick = (e) => {
    if (editMode && e.target.tagName === "IMG") {
      setSelectedImage(e.target);
      setShowImagePopup(true);
    }
  };

  // Cuando se sube una nueva imagen desde el modal
  const handleImageUpload = (file) => {
    const reader = new window.FileReader();
    reader.onload = (event) => {
      if (selectedImage) {
        selectedImage.src = event.target.result;
        // Actualiza el HTML editable
        if (contentRef.current) {
          setTempContent(contentRef.current.innerHTML);
        }
      }
      setShowImagePopup(false);
    };
    reader.readAsDataURL(file);
  };

  // Para edición: actualiza el tempContent con el HTML actual del div editable
  const handleInput = (e) => {
    setTempContent(e.currentTarget.innerHTML);
  };

  return (
    <div className={styles.documentTabWrapper}>
      <div className={styles.documentCard}>
        <div className={styles.documentCardHeader}>
          Visualización del contenido
        </div>
        <div className={styles.documentCardBody}>
          {editMode ? (
            <div
              className={styles.documentTextarea}
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onClick={handleImageClick}
              style={{
                minHeight: 200,
                maxHeight: 200,
                width: "100%",
                overflowY: "auto",
                outline: "none",
              }}
              dangerouslySetInnerHTML={{
                __html: tempContent || documentContent || DEFAULT_DOCUMENT_TEXT,
              }}
            />
          ) : (
            <div
              className={styles.documentTextDisplay}
              style={{
                minHeight: 200,
                maxHeight: 200,
                width: "100%",
                overflowY: "auto",
                whiteSpace: "pre-line",
                color: isEmpty ? "#b0b0b0" : "#22223b",
                opacity: isEmpty ? 0.7 : 1,
                fontStyle: isEmpty ? "italic" : "normal",
              }}
              dangerouslySetInnerHTML={{
                __html: isEmpty ? DEFAULT_DOCUMENT_TEXT : documentContent,
              }}
            />
          )}
        </div>
        {!editMode ? (
          <button
            className={styles.editBtn}
            onClick={() => {
              setTempContent(documentContent);
              setEditMode(true);
            }}
            type="button"
          >
            <FontAwesomeIcon icon={faPen} style={{ marginRight: 6 }} />
            Editar
          </button>
        ) : (
          <div className={styles.editActions}>
            <button
              className={styles.saveBtn}
              onClick={() => {
                setEditMode(false);
                setDocumentContent(tempContent);
                handleSaveDocument(tempContent);
              }}
              type="button"
              disabled={!canSave}
              style={{
                opacity: !canSave ? 0.5 : 1,
                cursor: !canSave ? "not-allowed" : "pointer",
              }}
            >
              <FontAwesomeIcon icon={faSave} style={{ marginRight: 4 }} />
              Guardar
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => setEditMode(false)}
              type="button"
            >
              <FontAwesomeIcon icon={faXmark} style={{ marginRight: 4 }} />
              Cancelar
            </button>
          </div>
        )}
      </div>
      <div style={{ marginTop: 24 }}>
        <a
          href={downloadUrl}
          className={styles.downloadLink}
          download
          style={{ color: "#7c3aed", textDecoration: "none" }}
        >
          Descargar visualización <FontAwesomeIcon icon={faDownload} />
        </a>
      </div>
      <UploadDocumentPopup
        isOpen={showImagePopup}
        onClose={() => setShowImagePopup(false)}
        onUpload={handleImageUpload}
        title="Subir imagen"
        message="Selecciona una imagen para reemplazar la actual"
      />
    </div>
  );
};

export default ActivityGenerationDocumentDocumentTab;
