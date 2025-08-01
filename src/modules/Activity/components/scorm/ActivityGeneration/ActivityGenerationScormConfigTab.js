import React from "react";
import styles from "./ActivityGenerationScormConfigTab.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const ActivityGenerationScormConfigTab = ({
  data,
  summary,
  instructions,
  setInstructions,
  includeImages,
  setIncludeImages,
}) => (
  <>
    <div className={styles.headerTitle}>
      <h2>Crear una presentación de diapositiva SCORM</h2>
      <p className={styles.description}>
        Esto creará una presentación de diapositiva SCORM basada en el tema que elijas.
      </p>
    </div>
    
    <div className={styles.dataCard}>
      <div className={styles.dataRow}>
        <div className={styles.dataCol}>
          <div className={styles.dataLabel}>Duración</div>
          <div className={styles.dataValue}>
            {data.duration ? `${data.duration} minuto` : "1 minuto"}
          </div>
        </div>
        <div className={styles.dataCol}>
          <div className={styles.dataLabel}>Formato</div>
          <div className={styles.dataValue}>Diapositiva SCORM</div>
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
    
    <div className={styles.instructionsContainer}>
      <div className={styles.instructionsLabel}>Instrucciones adicionales</div>
      <textarea
        className={styles.instructionsTextarea}
        placeholder="Introduce instrucciones adicionales del documento aquí....."
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />
    </div>
  </>
);

export default ActivityGenerationScormConfigTab;
