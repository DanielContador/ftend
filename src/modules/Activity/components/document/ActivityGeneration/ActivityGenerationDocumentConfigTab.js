import React from "react";
import styles from "./ActivityGenerationDocumentConfigTab.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const ActivityGenerationDocumentConfigTab = ({
  data,
  summary,
  instructions,
  setInstructions,
  includeImages,
  setIncludeImages,
}) => (
  <>
    <div className={styles.dataCard}>
      <div className={styles.dataCardHeader}>Datos</div>
      <div className={styles.dataRow}>
        <div className={styles.dataCol}>
          <div className={styles.dataLabel}>Duración</div>
          <div className={styles.dataValue}>
            {data.duration ? `${data.duration} minutos` : "-"}
          </div>
        </div>
        <div className={styles.dataCol}>
          <div className={styles.dataLabel}>Formato</div>
          <div className={styles.dataValue}>{data.contentType || "-"}</div>
        </div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.dataCol} style={{ flex: 1 }}>
          <div className={styles.dataLabel}>Objetivo de aprendizaje</div>
          <div className={styles.dataValue}>{data.learningGoal || "-"}</div>
        </div>
      </div>
    </div>
    <div className={styles.summaryCard}>
      <div className={styles.summaryCardHeader}>Resumen de contenido</div>
      <div className={styles.summaryListBox}>
        <ul className={styles.summaryList}>
          {summary.map((item, idx) => (
            <li key={idx} className={styles.summaryItem}>
              <FontAwesomeIcon
                icon={faCheckCircle}
                className={styles.checkIcon}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className={styles.switchContainer}>
      <label>Incluir imágenes</label>
      <input
        type="checkbox"
        checked={includeImages}
        onChange={(e) => setIncludeImages(e.target.checked)}
        style={{ marginLeft: 8 }}
      />
    </div>
    <div className={styles.instructionsContainer}>
      <textarea
        className={styles.instructionsTextarea}
        placeholder="Introduce instrucciones adicionales del documento aquí....."
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />
    </div>
  </>
);

export default ActivityGenerationDocumentConfigTab;
