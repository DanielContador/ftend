import React, { useRef, useState, useEffect } from "react";
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
import {
  updateScormByActivityId,
  uploadScormImage,
} from "../../../services/activityService";

const DEFAULT_SLIDE_TITLE = "Introducción al Tema";

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
  activityId,
  fetchActivity,
}) => {
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [slideTitle, setSlideTitle] = useState(
    activityDocument?.title || data?.title || DEFAULT_SLIDE_TITLE
  );
  const [tempSlideTitle, setTempSlideTitle] = useState(
    activityDocument?.title || data?.title || DEFAULT_SLIDE_TITLE
  );
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingContent, setEditingContent] = useState(false);
  const [tempDocumentContent, setTempDocumentContent] =
    useState(documentContent);
  const [slideImage, setSlideImage] = useState(null);
  const [tempSlideImage, setTempSlideImage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const contentRef = useRef(null);
  const titleRef = useRef(null);

  // Actualizar título y contenido cuando lleguen los datos del backend
  useEffect(() => {
    const newTitle =
      activityDocument?.title || data?.title || DEFAULT_SLIDE_TITLE;
    setSlideTitle(newTitle);
    setTempSlideTitle(newTitle);
  }, [activityDocument?.title, data?.title]);

  useEffect(() => {
    setTempDocumentContent(documentContent);
  }, [documentContent]);

  // Actualizar imagen cuando lleguen los datos del backend
  useEffect(() => {
    if (
      activityDocument?.imagePath &&
      activityDocument?.activityId
    ) {
      const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/download/textimage/file/${activityDocument.activityId}`;
      setSlideImage(imageUrl);
    } else {
      setSlideImage(null);
    }
  }, [activityDocument?.imagePath, activityDocument?.activityId]);

  // Mostrar contenido por defecto si no hay documento generado
  const isEmpty = !documentContent || documentContent.trim() === "";

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

  // Handler para cambiar la imagen de la diapositiva
  const handleSlideImageUpload = async (file) => {
    try {
      console.log("handleSlideImageUpload called with file:", file.name);
      console.log("activityId:", activityId);
      console.log("fetchActivity function available:", !!fetchActivity);

      setShowImagePopup(false);

      // Subir imagen al backend
      console.log("Calling uploadScormImage...");
      const response = await uploadScormImage(activityId, file);
      console.log("uploadScormImage response:", response);

      if (response.success && response.data) {
        console.log("Image uploaded successfully:", response.data.imagePath);

        // Refrescar datos del backend para obtener la nueva imagen
        if (fetchActivity) {
          console.log("Calling fetchActivity to refresh data...");
          await fetchActivity();
          console.log("fetchActivity completed");
        } else {
          console.warn("fetchActivity function not available");
        }
      } else {
        console.error("Upload failed or no data in response:", response);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  // Handler para abrir el selector de imagen
  const handleSelectImage = () => {
    setShowImagePopup(true);
  };

  // Handlers para drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;

    if (files && files.length > 0) {
      const file = files[0];

      // Verificar que sea una imagen
      if (file.type.startsWith("image/")) {
        handleSlideImageUpload(file);
      } else {
        console.error(
          "El archivo debe ser una imagen. Tipo recibido:",
          file.type
        );
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    } else {
      console.log("No files found in drop event");
    }
  };

  // Handler para editar el título de la diapositiva
  const handleTitleEdit = () => {
    setEditingTitle(true);
    setTempSlideTitle(slideTitle);
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.focus();
        titleRef.current.select();
      }
    }, 0);
  };

  // Handler para guardar el título editado
  const handleTitleSave = async () => {
    try {
      await updateScormByActivityId(activityDocument.id, {
        Title: tempSlideTitle,
      });
      setSlideTitle(tempSlideTitle);
      setEditingTitle(false);
      // Refrescar datos del backend para mantener sincronización
      if (fetchActivity) {
        await fetchActivity();
      }
    } catch (error) {
      console.error("Error saving title:", error);
      // Revertir cambios en caso de error
      setTempSlideTitle(slideTitle);
    }
  };

  // Handler para cancelar la edición del título
  const handleTitleCancel = () => {
    setTempSlideTitle(slideTitle);
    setEditingTitle(false);
  };

  // Handler para iniciar edición del contenido
  const handleContentEdit = () => {
    setEditingContent(true);
    setTempDocumentContent(documentContent);
    setTimeout(() => {
      if (contentRef.current) {
        // Set the initial content in the div
        contentRef.current.innerHTML = documentContent || "";
        contentRef.current.focus();
      }
    }, 0);
  };

  // Handler para guardar el contenido editado
  const handleContentSave = async () => {
    try {
      await updateScormByActivityId(activityDocument.id, {
        Content: tempDocumentContent,
      });
      setDocumentContent(tempDocumentContent);
      setEditingContent(false);
      // Refrescar datos del backend para mantener sincronización
      if (fetchActivity) {
        await fetchActivity();
      }
    } catch (error) {
      console.error("Error saving content:", error);
      // Revertir cambios en caso de error
      setTempDocumentContent(documentContent);
    }
  };

  // Handler para cancelar la edición del contenido
  const handleContentCancel = () => {
    setTempDocumentContent(documentContent);
    setEditingContent(false);
  };

  // Handler para guardar cambios de imagen (preparado para backend)
  const handleSaveSlideImage = () => {
    if (tempSlideImage) {
      setSlideImage(tempSlideImage);
      setTempSlideImage(null);
      // TODO: Llamar al backend para guardar la imagen cuando esté disponible
      // handleSaveImageToBackend(tempSlideImage);
    }
  };

  // Handler para guardar cambios de contenido (preparado para backend)
  const handleSaveSlideContent = () => {
    if (contentRef.current) {
      const html = contentRef.current.innerHTML;
      setDocumentContent(html);
      // TODO: Llamar al backend para guardar el contenido cuando esté disponible
      // handleSaveContentToBackend(html);
    }
  };

  // Initialize content editor only when component mounts or documentContent changes from outside
  useEffect(() => {
    if (contentRef.current && documentContent !== undefined) {
      const currentContent = contentRef.current.innerHTML;
      const newContent = documentContent || "";
      // Only update if content is different and editor is not focused
      if (
        currentContent !== newContent &&
        document.activeElement !== contentRef.current
      ) {
        contentRef.current.innerHTML = newContent;
      }
    }
  }, [documentContent]);

  // Initialize content on first render
  useEffect(() => {
    if (contentRef.current && !contentRef.current.innerHTML.trim()) {
      contentRef.current.innerHTML = documentContent || "";
    }
  }, []);

  // Update slide title when data changes
  useEffect(() => {
    if (data?.name && slideTitle === DEFAULT_SLIDE_TITLE) {
      setSlideTitle(data.name);
      setTempSlideTitle(data.name);
    }
  }, [data?.name]);

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
      {/* Título de la diapositiva */}
      <div className={styles.slideTitleSection}>
        <div className={styles.titleLabel}>Título de la Diapositiva</div>
        {editingTitle ? (
          <div className={styles.titleEditContainer}>
            <input
              ref={titleRef}
              type="text"
              value={tempSlideTitle}
              onChange={(e) => setTempSlideTitle(e.target.value)}
              className={styles.titleInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTitleSave();
                } else if (e.key === "Escape") {
                  handleTitleCancel();
                }
              }}
            />
            <div className={styles.titleActions}>
              <button className={styles.titleSaveBtn} onClick={handleTitleSave}>
                <FontAwesomeIcon icon={faSave} />
              </button>
              <button
                className={styles.titleCancelBtn}
                onClick={handleTitleCancel}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.titleDisplayContainer}>
            <input
              type="text"
              value={slideTitle}
              className={styles.titleDisplayInput}
              placeholder="Introducción al Tema"
              readOnly
            />
            <button className={styles.titleEditBtn} onClick={handleTitleEdit}>
              <FontAwesomeIcon icon={faPen} />
            </button>
          </div>
        )}
      </div>

      {/* Contenido principal con layout de dos columnas */}
      <div className={styles.mainContent}>
        {/* Columna izquierda - Imagen */}
        <div className={styles.imageSection}>
          <h4 className={styles.sectionTitle}>Imagen de la Diapositiva</h4>
          <div
            className={styles.imageContainer}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: isDragOver ? "2px dashed #7c3aed" : undefined,
              backgroundColor: isDragOver ? "#f3f4f6" : undefined,
            }}
          >
            {tempSlideImage || slideImage ? (
              <>
                <div className={styles.imagePreview}>
                  <img
                    src={tempSlideImage || slideImage}
                    alt="Slide preview"
                    className={styles.slideImagePreview}
                  />
                </div>
                <button
                  className={styles.selectImageBtn}
                  onClick={handleSelectImage}
                >
                  Seleccionar Archivo
                </button>
                <p className={styles.imageFormats}>JPG, PNG, GIF hasta 5MB</p>
              </>
            ) : (
              <div
                className={`${styles.imagePlaceholder} ${
                  isDragOver ? styles.dragOver : ""
                }`}
                style={{
                  borderColor: isDragOver ? "#7c3aed" : undefined,
                  backgroundColor: isDragOver ? "#f8fafc" : undefined,
                }}
              >
                <FontAwesomeIcon
                  icon={faImage}
                  className={styles.placeholderIcon}
                />
                <span className={styles.placeholderText}>Subir Imagen</span>
                <p className={styles.placeholderSubtext}>
                  Arrastra y suelta una imagen o haz clic para seleccionar
                </p>
                <button
                  className={styles.selectImageBtn}
                  onClick={handleSelectImage}
                >
                  Seleccionar Archivo
                </button>
                <p className={styles.imageFormats}>JPG, PNG, GIF hasta 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha - Contenido */}
        <div className={styles.contentSection}>
          <div className={styles.contentHeader}>
            <h4 className={styles.sectionTitle}>Contenido de la Diapositiva</h4>
          </div>

          {/* Barra de herramientas de formato - siempre visible */}
          <div className={styles.toolbarContainer}>
            <div className={styles.toolbar}>
              <button
                className={`${styles.toolbarBtn} ${
                  !editingContent ? styles.toolbarBtnDisabled : ""
                }`}
                onClick={() => editingContent && formatText("bold")}
                title="Negrita"
                disabled={!editingContent}
              >
                <FontAwesomeIcon icon={faBold} />
              </button>
              <button
                className={`${styles.toolbarBtn} ${
                  !editingContent ? styles.toolbarBtnDisabled : ""
                }`}
                onClick={() => editingContent && formatText("italic")}
                title="Cursiva"
                disabled={!editingContent}
              >
                <FontAwesomeIcon icon={faItalic} />
              </button>
              <button
                className={`${styles.toolbarBtn} ${
                  !editingContent ? styles.toolbarBtnDisabled : ""
                }`}
                onClick={() => editingContent && formatText("underline")}
                title="Subrayado"
                disabled={!editingContent}
              >
                <FontAwesomeIcon icon={faUnderline} />
              </button>
              <button
                className={`${styles.toolbarBtn} ${
                  !editingContent ? styles.toolbarBtnDisabled : ""
                }`}
                onClick={() =>
                  editingContent && formatText("insertUnorderedList")
                }
                title="Lista con viñetas"
                disabled={!editingContent}
              >
                <FontAwesomeIcon icon={faListUl} />
              </button>
              <button
                className={`${styles.toolbarBtn} ${
                  !editingContent ? styles.toolbarBtnDisabled : ""
                }`}
                onClick={() =>
                  editingContent && formatText("insertOrderedList")
                }
                title="Lista numerada"
                disabled={!editingContent}
              >
                <FontAwesomeIcon icon={faListOl} />
              </button>
              <button
                className={`${styles.toolbarBtn} ${
                  !editingContent ? styles.toolbarBtnDisabled : ""
                }`}
                onClick={() => {
                  if (editingContent) {
                    const url = prompt("Ingresa la URL del enlace:");
                    if (url) formatText("createLink", url);
                  }
                }}
                title="Insertar enlace"
                disabled={!editingContent}
              >
                <FontAwesomeIcon icon={faLink} />
              </button>
            </div>

            {/* Botones de acción - a la derecha de la toolbar */}
            {!editingContent ? (
              <button
                className={styles.editContentBtn}
                onClick={handleContentEdit}
                type="button"
                disabled={!documentContent || documentContent.trim() === ""}
              >
                <FontAwesomeIcon icon={faPen} style={{ marginRight: 6 }} />
                Editar
              </button>
            ) : (
              <div className={styles.editContentActions}>
                <button
                  className={styles.saveContentBtn}
                  onClick={handleContentSave}
                  type="button"
                >
                  <FontAwesomeIcon icon={faSave} style={{ marginRight: 4 }} />
                  Guardar
                </button>
                <button
                  className={styles.cancelContentBtn}
                  onClick={handleContentCancel}
                  type="button"
                >
                  <FontAwesomeIcon icon={faXmark} style={{ marginRight: 4 }} />
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Área de contenido editable - siempre en modo editable pero deshabilitado hasta hacer clic en Editar */}
          <div className={styles.contentContainer}>
            <div
              className={styles.contentTextarea}
              ref={contentRef}
              contentEditable={editingContent}
              suppressContentEditableWarning
              onInput={(e) => {
                if (editingContent) {
                  const content = e.target.innerHTML;
                  setTempDocumentContent(content);
                }
              }}
              onBlur={(e) => {
                if (editingContent) {
                  const content = e.target.innerHTML;
                  setTempDocumentContent(content);
                }
              }}
              onClick={(e) => {
                if (!editingContent) {
                  e.preventDefault();
                }
              }}
              style={{
                backgroundColor: editingContent ? "#fff" : "#f9f9f9",
                cursor: editingContent ? "text" : "default",
                border: editingContent
                  ? "2px solid #7c3aed"
                  : "1px solid #e5e7eb",
                pointerEvents: editingContent ? "auto" : "none",
              }}
            />
          </div>
        </div>
      </div>

      <UploadDocumentPopup
        isOpen={showImagePopup}
        onClose={() => {
          setShowImagePopup(false);
        }}
        onUpload={handleSlideImageUpload}
        title="Subir imagen"
        message="Selecciona una imagen para la diapositiva"
      />
    </div>
  );
};

export default ActivityGenerationScormDocumentTab;
