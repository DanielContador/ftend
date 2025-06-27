import React from "react";
import styles from "./ActivityGenerationAudioConfigTab.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const ActivityGenerationAudioConfigTab = ({
  data,
  summary,
  guionInput,
  setGuionInput,
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
    <div className={styles.guionCard}>
      <div className={styles.guionCardHeader}>Generación de guión...</div>
      <div className={styles.guionBox}>
        <input
          className={styles.guionInput}
          placeholder="Introduce instrucciones adicionales del audio aquí....."
          value={guionInput}
          onChange={(e) => setGuionInput(e.target.value)}
        />
      </div>
    </div>
  </>
);

export default ActivityGenerationAudioConfigTab;
