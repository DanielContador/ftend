import React from "react";
import styles from "./ActivityGenerationDocumentDocumentTab.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faPen,
  faSave,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const DEFAULT_DOCUMENT_TEXT = `Ejemplo de documento generado por MentorIA.
Aquí aparecerá el contenido generado para tu recurso de texto (PDF, Word, etc).
Cuando generes el documento, este texto será reemplazado automáticamente.`;

function extractTextFromHtml(html) {
  // Crea un elemento temporal y extrae solo el texto plano
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html || "";
  return tempDiv.textContent || tempDiv.innerText || "";
}

function replaceTextInHtml(html, newText) {
  // Reemplaza solo el texto plano del HTML por el nuevo texto, manteniendo las imágenes y estructura
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html || "";
  // Elimina todos los nodos de texto y reemplaza por uno nuevo con el texto plano
  // Si hay imágenes, las mantiene en el mismo orden
  // Si hay solo texto, lo reemplaza completamente
  // Si hay mezcla, reemplaza solo los nodos de texto
  // Para simplicidad, aquí reemplazamos todo el contenido por el nuevo texto plano y luego agregamos las imágenes al final
  const images = Array.from(tempDiv.querySelectorAll("img"));
  tempDiv.innerHTML = ""; // Limpia todo
  // Agrega el texto plano como un solo nodo de texto
  tempDiv.appendChild(document.createTextNode(newText));
  // Agrega las imágenes al final
  images.forEach((img) => tempDiv.appendChild(img));
  return tempDiv.innerHTML;
}

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
  // URL de descarga del documento generado
  const downloadUrl =
    activityDocument && fileToken
      ? `${process.env.NEXT_PUBLIC_API_URL}/v1/download/${data.contentType}/file/${activityDocument.activityId}?token=${fileToken}`
      : "";

  // Mostrar texto por defecto si no hay documento generado
  const isEmpty = !documentContent || documentContent.trim() === "";

  // Extrae solo el texto plano del documento generado
  const plainText = isEmpty
    ? DEFAULT_DOCUMENT_TEXT
    : extractTextFromHtml(documentContent);

  // Si no hay activityDocument o no tiene id, deshabilita el botón de guardar
  const canSave =
    activityDocument &&
    activityDocument.id &&
    typeof activityDocument.id !== "undefined" &&
    activityDocument.id !== null;

  return (
    <div className={styles.documentTabWrapper}>
      <div className={styles.documentCard}>
        <div className={styles.documentCardHeader}>
          Visualización del contenido
        </div>
        <div className={styles.documentCardBody}>
          {editMode ? (
            <textarea
              className={styles.documentTextarea}
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
              style={{
                minHeight: 200,
                maxHeight: 200,
                width: "100%",
                overflowY: "auto",
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
            >
              {plainText}
            </div>
          )}
        </div>
        {!editMode ? (
          <button
            className={styles.editBtn}
            onClick={() => {
              setTempContent(plainText);
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
                if (!canSave) return;
                const newHtml = replaceTextInHtml(documentContent, tempContent);
                setEditMode(false);
                setDocumentContent(newHtml);
                handleSaveDocument(newHtml);
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
    </div>
  );
};

export default ActivityGenerationDocumentDocumentTab;
