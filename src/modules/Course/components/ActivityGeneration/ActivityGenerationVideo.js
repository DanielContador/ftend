import React, { useState } from "react";
import styles from "./ActivityGenerationVideo.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCheckCircle,
  faWandSparkles,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

const TABS = [
  { key: "config", label: "Configuración" },
  { key: "guion", label: "Guión" },
  { key: "video", label: "Video" },
];

const DEFAULT_GUIÓN = `¿Qué es la IA?
La inteligencia artificial, o IA, se refiere a la capacidad de las máquinas y sistemas informáticos para realizar tareas que normalmente requieren inteligencia humana. Esto incluye procesos como el aprendizaje, el razonamiento, la resolución de problemas, la percepción y la toma de decisiones. En su esencia, la IA busca simular la forma en que los humanos piensan y actúan, utilizando algoritmos y modelos matemáticos para interpretar datos, aprender de la experiencia y adaptarse a nuevas situaciones......`;

const ActivityGenerationVideo = ({ open, onClose, data = {} }) => {
  const [activeTab, setActiveTab] = useState("config");
  const [guionInput, setGuionInput] = useState(DEFAULT_GUIÓN);
  const [guionEdit, setGuionEdit] = useState(false);

  if (!open) return null;

  // Parse content if needed
  let summary = [];
  if (data.content && Array.isArray(data.content)) {
    try {
      if (data.content.length === 1 && typeof data.content[0] === "string") {
        summary = JSON.parse(data.content[0]);
      } else {
        summary = data.content;
      }
    } catch {
      summary = [];
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <div
              key={tab.key}
              className={`${styles.tab} ${
                activeTab === tab.key ? styles.active : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
              style={{ userSelect: "none" }}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <div className={styles.modalContent}>
          {activeTab === "config" ? (
            <>
              <div className={styles.dataCard}>
                <div className={styles.dataCardHeader}>Datos</div>
                <div className={styles.dataRow}>
                  <div className={styles.dataCol}>
                    <div className={styles.dataLabel}>Duración</div>
                    <div className={styles.dataValue}>
                      {data.estimated_time
                        ? `${data.estimated_time} minutos`
                        : "-"}
                    </div>
                  </div>
                  <div className={styles.dataCol}>
                    <div className={styles.dataLabel}>Formato</div>
                    <div className={styles.dataValue}>{data.format || "-"}</div>
                  </div>
                </div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryCardHeader}>
                  Resumen de contenido
                </div>
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
                <div className={styles.guionCardHeader}>
                  Generación de guión...
                </div>
                <div className={styles.guionBox}>
                  <input
                    className={styles.guionInput}
                    placeholder="Introduce instrucciones adicionales del video aquí....."
                    value={guionInput}
                    onChange={(e) => setGuionInput(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : activeTab === "guion" ? (
            <div style={{ width: "100%" }}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 4px 18px 0 rgba(127, 86, 217, 0.10)",
                  padding: "0",
                  marginBottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  marginTop: 0,
                }}
              >
                <div
                  style={{
                    background: "#fafbfc",
                    padding: "18px 28px 10px 28px",
                    fontSize: "1.13rem",
                    fontWeight: 700,
                    color: "#22223b",
                    borderBottom: "1.5px solid #f3f0fd",
                  }}
                >
                  Guión del video
                </div>
                <div
                  style={{
                    padding: "18px 28px 10px 28px",
                    position: "relative",
                  }}
                >
                  {guionEdit ? (
                    <textarea
                      style={{
                        width: "100%",
                        minHeight: 110,
                        borderRadius: 12,
                        border: "1.5px solid #ececec",
                        background: "#fafbfc",
                        fontSize: "1.07rem",
                        color: "#22223b",
                        padding: "16px 18px",
                        resize: "vertical",
                        outline: "none",
                        fontWeight: 500,
                      }}
                      value={guionInput}
                      onChange={(e) => setGuionInput(e.target.value)}
                      onBlur={() => setGuionEdit(false)}
                      autoFocus
                    />
                  ) : (
                    <div
                      style={{
                        minHeight: 110,
                        border: "1.5px dashed #d1c4f7",
                        borderRadius: 12,
                        background: "#fafbfc",
                        color: "#22223b",
                        fontSize: "1.07rem",
                        padding: "16px 18px",
                        whiteSpace: "pre-line",
                        fontWeight: 500,
                        position: "relative",
                        cursor: "pointer",
                      }}
                      onClick={() => setGuionEdit(true)}
                    >
                      {guionInput}
                      <FontAwesomeIcon
                        icon={faPen}
                        style={{
                          position: "absolute",
                          right: 18,
                          bottom: 18,
                          color: "#b0b0b0",
                          fontSize: 18,
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setGuionEdit(true);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 4px 18px 0 rgba(127, 86, 217, 0.10)",
                  padding: "0",
                  marginTop: 24,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "#fafbfc",
                    padding: "18px 28px 10px 28px",
                    fontSize: "1.13rem",
                    fontWeight: 700,
                    color: "#22223b",
                    borderBottom: "1.5px solid #f3f0fd",
                  }}
                >
                  Componentes del video
                </div>
                <div
                  style={{
                    padding: "18px 28px 18px 28px",
                    display: "flex",
                    gap: 24,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontWeight: 600,
                        color: "#888",
                        fontSize: "1.01rem",
                        marginBottom: 6,
                        display: "block",
                      }}
                    >
                      Tipo de video
                    </label>
                    <select
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        border: "1.5px solid #ececec",
                        background: "#fafbfc",
                        fontSize: "1.07rem",
                        color: "#22223b",
                        padding: "10px 12px",
                        marginTop: 4,
                        outline: "none",
                      }}
                      disabled
                    >
                      <option>Seleccionar</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontWeight: 600,
                        color: "#888",
                        fontSize: "1.01rem",
                        marginBottom: 6,
                        display: "block",
                      }}
                    >
                      Voz del avatar
                    </label>
                    <select
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        border: "1.5px solid #ececec",
                        background: "#fafbfc",
                        fontSize: "1.07rem",
                        color: "#22223b",
                        padding: "10px 12px",
                        marginTop: 4,
                        outline: "none",
                      }}
                      disabled
                    >
                      <option>Seleccionar</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                minHeight: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.15rem",
                color: "#b0b0b0",
                fontWeight: 600,
              }}
            >
              No hay datos para mostrar en esta pestaña.
            </div>
          )}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.backBtn} onClick={onClose}>
            ← Atrás
          </button>
          {activeTab === "guion" ? (
            <button className={styles.generateBtn}>
              Continuar{" "}
              <FontAwesomeIcon
                className={styles.sparkles}
                icon={faWandSparkles}
              />
            </button>
          ) : (
            <button className={styles.generateBtn}>
              Generar{" "}
              <FontAwesomeIcon
                className={styles.sparkles}
                icon={faWandSparkles}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityGenerationVideo;
