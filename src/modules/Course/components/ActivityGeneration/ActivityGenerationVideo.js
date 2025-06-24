import React, { useState } from "react";
import styles from "./ActivityGenerationVideo.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faWandSparkles,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import ActivityGenerationVideoConfigTab from "./ActivityGenerationVideoConfigTab";
import ActivityGenerationVideoGuionTab from "./ActivityGenerationVideoGuionTab";
import ActivityGenerationVideoVideoTab from "./ActivityGenerationVideoVideoTab";

const TABS = [
  { key: "config", label: "Configuración" },
  { key: "guion", label: "Guión" },
  { key: "video", label: "Video" },
];

const DEFAULT_GUIÓN = `¿Qué es la IA?
La inteligencia artificial, o IA, se refiere a la capacidad de las máquinas y sistemas informáticos para realizar tareas que normalmente requieren inteligencia humana. Esto incluye procesos como el aprendizaje, el razonamiento, la resolución de problemas, la percepción y la toma de decisiones. En su esencia, la IA busca simular la forma en que los humanos piensan y actúan, utilizando algoritmos y modelos matemáticos para interpretar datos, aprender de la experiencia y adaptarse a nuevas situaciones......`;

const ActivityGenerationVideo = ({ open, onClose, data = {} }) => {
  const [activeTab, setActiveTab] = useState("config");
  const [configGuionInput, setConfigGuionInput] = useState("");
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

  // Manejar el botón atrás según el tab activo
  const handleBack = () => {
    if (activeTab === "config") {
      onClose();
    } else if (activeTab === "guion") {
      setActiveTab("config");
    } else if (activeTab === "video") {
      setActiveTab("guion");
    }
  };

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
          {activeTab === "config" && (
            <ActivityGenerationVideoConfigTab
              data={data}
              summary={summary}
              guionInput={configGuionInput}
              setGuionInput={setConfigGuionInput}
            />
          )}
          {activeTab === "guion" && (
            <ActivityGenerationVideoGuionTab
              guionInput={guionInput}
              setGuionInput={setGuionInput}
              guionEdit={guionEdit}
              setGuionEdit={setGuionEdit}
            />
          )}
          {activeTab === "video" && <ActivityGenerationVideoVideoTab />}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.backBtn} onClick={handleBack}>
            <FontAwesomeIcon className={styles.sparkles} icon={faArrowLeft} />
            Atrás
          </button>
          {activeTab === "guion" ? (
            <button className={styles.generateBtn}>
              Continuar{" "}
              <FontAwesomeIcon
                className={styles.sparkles}
                icon={faArrowRight}
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
