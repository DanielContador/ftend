import React from "react";
import styles from "./ActivityGenerationDocumentDocumentTab.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faPen,
  faSave,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

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
                maxHeight: 300,
                width: "100%",
                overflowY: "auto",
              }}
            />
          ) : (
            <div
              className={styles.documentTextDisplay}
              style={{
                minHeight: 200,
                maxHeight: 300,
                width: "100%",
                overflowY: "auto",
                whiteSpace: "pre-line",
              }}
            >
              {documentContent}
            </div>
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
              onClick={() => handleSaveDocument(tempContent)}
              type="button"
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
