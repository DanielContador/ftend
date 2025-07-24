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
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const contentRef = useRef(null);

  // URL de descarga del documento generado
  const downloadUrl =
    activityDocument && fileToken
      ? `${process.env.NEXT_PUBLIC_API_URL}/v1/download/${data.contentType}/file/${activityDocument.activityId}?token=${fileToken}`
      : "";

  const isDownloadDisabled = !activityDocument || !fileToken;

  // Mostrar texto por defecto si no hay documento generado
  const isEmpty = !documentContent || documentContent.trim() === "";

  const isEditDisabled = isEmpty;

  // Si no hay activityDocument o no tiene id, deshabilita el botón de guardar
  const canSave =
    activityDocument &&
    activityDocument.id &&
    typeof activityDocument.id !== "undefined" &&
    activityDocument.id !== null;

  // Cuando se hace click en una imagen en modo edición
  const handleImageClick = (e) => {
    if (editMode && e.target.tagName === "IMG") {
      // Encuentra el índice de la imagen clickeada dentro del contentEditable
      if (contentRef.current) {
        const images = Array.from(contentRef.current.querySelectorAll("img"));
        const idx = images.indexOf(e.target);
        setSelectedImageIndex(idx);
        setShowImagePopup(true);
      }
    }
  };

  // Cuando se sube una nueva imagen desde el modal
  const handleImageUpload = (file) => {
    const reader = new window.FileReader();
    reader.onload = (event) => {
      if (
        contentRef.current &&
        selectedImageIndex !== null &&
        selectedImageIndex >= 0
      ) {
        const images = Array.from(contentRef.current.querySelectorAll("img"));
        const img = images[selectedImageIndex];
        if (img) {
          // Guardar tamaño original
          const width = img.width || img.style.width;
          const height = img.height || img.style.height;
          img.src = event.target.result;
          // Restaurar tamaño si existía
          if (width) img.width = width;
          if (height) img.height = height;
          // Actualiza el HTML editable
          setTempContent(contentRef.current.innerHTML);
        }
      }
      setShowImagePopup(false);
      setSelectedImageIndex(null);
    };
    reader.readAsDataURL(file);
  };

  // Cuando se da guardar, actualiza el contenido y sale de edición
  const handleSave = () => {
    if (contentRef.current) {
      const html = contentRef.current.innerHTML;
      setTempContent(html);
      setDocumentContent(html);
      // Enviar el HTML completo (texto e imágenes) al backend
      handleSaveDocument(html);
    }
    setEditMode(false);
  };

  // Cuando se cancela, vuelve al contenido original
  const handleCancel = () => {
    setEditMode(false);
    setTempContent(documentContent);
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
              onClick={handleImageClick}
              dangerouslySetInnerHTML={{
                __html:
                  tempContent !== undefined && tempContent !== null
                    ? tempContent
                    : documentContent || DEFAULT_DOCUMENT_TEXT,
              }}
            />
          ) : (
            <div
              className={styles.documentTextDisplay}
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
              if (isEditDisabled) return;
              setTempContent(documentContent);
              setEditMode(true);
            }}
            type="button"
            disabled={isEditDisabled}
            style={{
              opacity: isEditDisabled ? 0.5 : 1,
              cursor: isEditDisabled ? "not-allowed" : "pointer",
            }}
          >
            <FontAwesomeIcon icon={faPen} style={{ marginRight: 6 }} />
            Editar
          </button>
        ) : (
          <div className={styles.editActions}>
            <button
              className={styles.saveBtn}
              onClick={handleSave}
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
              onClick={handleCancel}
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
          href={!isDownloadDisabled ? downloadUrl : undefined}
          className={styles.downloadLink}
          download
          style={{
            color: "#7c3aed",
            textDecoration: "none",
            opacity: isDownloadDisabled ? 0.5 : 1,
            cursor: isDownloadDisabled ? "not-allowed" : "pointer",
          }}
          onClick={(e) => {
            if (isDownloadDisabled) {
              e.preventDefault();
            }
          }}
        >
          Descargar visualización <FontAwesomeIcon icon={faDownload} />
        </a>
      </div>
      <UploadDocumentPopup
        isOpen={showImagePopup}
        onClose={() => {
          setShowImagePopup(false);
          setSelectedImageIndex(null);
        }}
        onUpload={handleImageUpload}
        title="Subir imagen"
        message="Selecciona una imagen para reemplazar la actual"
      />
    </div>
  );
};

export default ActivityGenerationDocumentDocumentTab;
