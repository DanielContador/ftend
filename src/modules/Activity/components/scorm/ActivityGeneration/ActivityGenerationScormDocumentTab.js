import React, { useRef, useState } from "react";
import styles from "./ActivityGenerationScormDocumentTab.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faPen,
  faSave,
  faXmark,
  faImage,
  faBold,
  faItalic,
  faUnderline,
  faListUl,
  faListOl,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import UploadDocumentPopup from "../../../../../shared/components/UploadDocumentPopup";

const DEFAULT_SLIDE_TITLE = "Introducción al Tema";
const DEFAULT_SLIDE_CONTENT = `Este es el contenido de ejemplo para la diapositiva SCORM. **Puntos principales:** • Concepto fundamental del tema • Aplicaciones prácticas • Ejemplos relevantes El contenido debe ser claro y estructurado para facilitar el aprendizaje del estudiante.`;

const ActivityGenerationScormDocumentTab = ({
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
  const [slideTitle, setSlideTitle] = useState(DEFAULT_SLIDE_TITLE);
  const [tempSlideTitle, setTempSlideTitle] = useState(DEFAULT_SLIDE_TITLE);
  const [editingTitle, setEditingTitle] = useState(false);
  const contentRef = useRef(null);
  const titleRef = useRef(null);

  // URL de descarga del documento SCORM generado
  const downloadUrl =
    activityDocument && fileToken
      ? `${process.env.NEXT_PUBLIC_API_URL}/v1/download/${data.contentType}/file/${activityDocument.activityId}?token=${fileToken}`
      : "";

  const isDownloadDisabled = !activityDocument || !fileToken;

  // Mostrar contenido por defecto si no hay documento generado
  const isEmpty = !documentContent || documentContent.trim() === "";

  const isEditDisabled = isEmpty;

  // Si no hay activityDocument o no tiene id, deshabilita el botón de guardar
  const canSave =
    activityDocument &&
    activityDocument.id &&
    typeof activityDocument.id !== "undefined" &&
    activityDocument.id !== null;

  // Funciones de formato de texto
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
      setTempContent(contentRef.current.innerHTML);
    }
  };

  // Cuando se hace click en una imagen en modo edición
  const handleImageClick = (e) => {
    if (editMode && e.target.tagName === "IMG") {
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
          const width = img.width || img.style.width;
          const height = img.height || img.style.height;
          img.src = event.target.result;
          if (width) img.width = width;
          if (height) img.height = height;
          setTempContent(contentRef.current.innerHTML);
        }
      }
      setShowImagePopup(false);
      setSelectedImageIndex(null);
    };
    reader.readAsDataURL(file);
  };

  // Subir imagen nueva
  const handleImageUploadNew = () => {
    setShowImagePopup(true);
    setSelectedImageIndex(-1); // Indica nueva imagen
  };

  // Cuando se da guardar, actualiza el contenido y sale de edición
  const handleSave = () => {
    if (contentRef.current) {
      const html = contentRef.current.innerHTML;
      setTempContent(html);
      setDocumentContent(html);
      handleSaveDocument(html);
    }
    if (titleRef.current) {
      setSlideTitle(tempSlideTitle);
    }
    setEditMode(false);
    setEditingTitle(false);
  };

  // Cuando se cancela, vuelve al contenido original
  const handleCancel = () => {
    setEditMode(false);
    setEditingTitle(false);
    setTempContent(documentContent);
    setTempSlideTitle(slideTitle);
  };

  return (
    <div className={styles.documentTabWrapper}>
      {/* Título de la Diapositiva */}
      <div className={styles.titleSection}>
        <div className={styles.titleLabel}>Título de la Diapositiva</div>
        {editingTitle ? (
          <input
            ref={titleRef}
            className={styles.titleInput}
            value={tempSlideTitle}
            onChange={(e) => setTempSlideTitle(e.target.value)}
            placeholder="Introducción al Tema"
          />
        ) : (
          <div className={styles.titleDisplay}>
            {slideTitle}
            <button
              className={styles.editTitleBtn}
              onClick={() => {
                setTempSlideTitle(slideTitle);
                setEditingTitle(true);
              }}
            >
              <FontAwesomeIcon icon={faPen} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.contentContainer}>
        {/* Imagen de la Diapositiva */}
        <div className={styles.imageSection}>
          <div className={styles.imageLabel}>Imagen de la Diapositiva</div>
          <div className={styles.imageUploadArea}>
            <div className={styles.imageIcon}>
              <FontAwesomeIcon icon={faImage} />
            </div>
            <div className={styles.imageUploadText}>
              <div className={styles.uploadTitle}>Subir Imagen</div>
              <div className={styles.uploadSubtitle}>
                Arrastra y suelta una imagen o haz clic para seleccionar
              </div>
              <button
                className={styles.selectFileBtn}
                onClick={handleImageUploadNew}
              >
                Seleccionar Archivo
              </button>
              <div className={styles.fileFormats}>JPG, PNG, GIF hasta 5MB</div>
            </div>
          </div>
        </div>

        {/* Contenido de la Diapositiva */}
        <div className={styles.contentSection}>
          <div className={styles.contentLabel}>Contenido de la Diapositiva</div>
          
          {editMode && (
            <div className={styles.toolbar}>
              <button
                className={styles.toolbarBtn}
                onClick={() => formatText('bold')}
                title="Negrita"
              >
                <FontAwesomeIcon icon={faBold} />
              </button>
              <button
                className={styles.toolbarBtn}
                onClick={() => formatText('italic')}
                title="Cursiva"
              >
                <FontAwesomeIcon icon={faItalic} />
              </button>
              <button
                className={styles.toolbarBtn}
                onClick={() => formatText('underline')}
                title="Subrayado"
              >
                <FontAwesomeIcon icon={faUnderline} />
              </button>
              <button
                className={styles.toolbarBtn}
                onClick={() => formatText('insertUnorderedList')}
                title="Lista con viñetas"
              >
                <FontAwesomeIcon icon={faListUl} />
              </button>
              <button
                className={styles.toolbarBtn}
                onClick={() => formatText('insertOrderedList')}
                title="Lista numerada"
              >
                <FontAwesomeIcon icon={faListOl} />
              </button>
              <button
                className={styles.toolbarBtn}
                onClick={() => {
                  const url = prompt('Ingresa la URL del enlace:');
                  if (url) formatText('createLink', url);
                }}
                title="Insertar enlace"
              >
                <FontAwesomeIcon icon={faLink} />
              </button>
            </div>
          )}

          <div className={styles.contentCard}>
            {editMode ? (
              <div
                className={styles.contentTextarea}
                ref={contentRef}
                contentEditable
                suppressContentEditableWarning
                onClick={handleImageClick}
                dangerouslySetInnerHTML={{
                  __html:
                    tempContent !== undefined && tempContent !== null
                      ? tempContent
                      : documentContent || DEFAULT_SLIDE_CONTENT,
                }}
              />
            ) : (
              <div
                className={styles.contentDisplay}
                dangerouslySetInnerHTML={{
                  __html: isEmpty ? DEFAULT_SLIDE_CONTENT : documentContent,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className={styles.actionButtons}>
        {!editMode && !editingTitle ? (
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

      <UploadDocumentPopup
        isOpen={showImagePopup}
        onClose={() => {
          setShowImagePopup(false);
          setSelectedImageIndex(null);
        }}
        onUpload={handleImageUpload}
        title="Subir imagen"
        message="Selecciona una imagen para la diapositiva"
      />
    </div>
  );
};

export default ActivityGenerationScormDocumentTab;
