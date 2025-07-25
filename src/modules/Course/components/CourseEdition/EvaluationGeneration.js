import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWandMagicSparkles,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./EvaluationGeneration.module.css";

const EvaluationGeneration = ({ onGenerate }) => {
  const [questionCount, setQuestionCount] = useState(30);
  const [minPassingScore, setMinPassingScore] = useState(70);
  const [evaluationContent, setEvaluationContent] = useState(
    "Las preguntas deben evaluar conceptos básicos como definición, diferencias clave, ventajas, desventajas y aplicaciones prácticas. El nivel de dificultad debe ser introductorio, pensado para estudiantes que recién comienzan en el área de inteligencia artificial..."
  );

  const handleGenerate = () => {
    const evaluationConfig = {
      questionCount,
      minPassingScore,
      evaluationContent,
    };
    if (onGenerate) {
      onGenerate(evaluationConfig);
    }
    console.log(
      "Generando evaluación con la siguiente configuración:",
      evaluationConfig
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <button className={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Atrás
        </button>
      </div>

      {/* Main Title */}
      <div className={styles.header}>
        <h1 className={styles.title}>Evaluación diagnóstica</h1>
        <p className={styles.subtitle}>
          Algunas preguntas para evaluar la comprensión de los estudiantes de
          este módulo.
        </p>
      </div>

      {/* Configuration Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Configuración de la evaluación</h2>
        <div className={styles.configRow}>
          <div className={styles.configField}>
            <label className={styles.fieldLabel}>Cantidad de preguntas</label>
            <input
              type="number"
              className={styles.numberInput}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 0)}
              min="1"
              max="100"
            />
          </div>
          <div className={styles.configField}>
            <label className={styles.fieldLabel}>
              Puntaje mínimo de aprobación (%)
            </label>
            <input
              type="number"
              className={styles.numberInput}
              value={minPassingScore}
              onChange={(e) =>
                setMinPassingScore(parseInt(e.target.value) || 0)
              }
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>

      {/* AI Generation Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Generación automática con IA</h2>
        <p className={styles.sectionDescription}>
          Describe el contenido de tu evaluación
        </p>
        <textarea
          className={styles.contentTextarea}
          value={evaluationContent}
          onChange={(e) => setEvaluationContent(e.target.value)}
          rows={8}
          placeholder="Las preguntas deben evaluar conceptos básicos como definición, diferencias clave, ventajas, desventajas y aplicaciones prácticas. El nivel de dificultad debe ser introductorio, pensado para estudiantes que recién comienzan en el área de inteligencia artificial..."
        />

        <div className={styles.buttonContainer}>
          <button className={styles.generateButton} onClick={handleGenerate}>
            <FontAwesomeIcon
              icon={faWandMagicSparkles}
              className={styles.buttonIcon}
            />
            Generar con IA
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationGeneration;
