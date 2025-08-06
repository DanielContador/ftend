import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWandMagicSparkles,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./EvaluationGeneration.module.css";

const EvaluationGeneration = ({ onGenerate, moduleEvaluation, onBack }) => {
  // Use real values from moduleEvaluation instead of hardcoded values
  console.log("EvaluationGeneration", moduleEvaluation);
  
  // Early return if moduleEvaluation is undefined to prevent errors
  if (!moduleEvaluation) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>No se encontró información de evaluación para este módulo.</p>
        <button onClick={onBack} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Volver
        </button>
      </div>
    );
  }
  const [questionCount, setQuestionCount] = useState(
    moduleEvaluation?.estimated_time || 30
  );
  const [minPassingScore, setMinPassingScore] = useState(
    moduleEvaluation?.min_passing_score || 70
  );
  const [evaluationContent, setEvaluationContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Create the evaluationData object that matches the backend API structure
    const evaluationData = {
      ActivityId: moduleEvaluation?.id,
      Prompt: evaluationContent || "",
      Multiple_Choise: true,
      Cant_Questions: questionCount, // Use the actual question count from input
      // Additional parameters that might be useful
      QuestionCount: questionCount,
      MinPassingScore: minPassingScore,
    };

    if (onGenerate && moduleEvaluation?.id) {
      // Pass callback to handle completion
      onGenerate(evaluationData, () => {
        setIsGenerating(false);
        // The parent component will handle redirecting to EvaluationEdition
      });
    } else {
      console.error("No moduleEvaluation ID available for generation");
      setIsGenerating(false);
    }

    console.log(
      "Generando evaluación con la siguiente configuración:",
      evaluationData
    );
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  // Allow generate button to be clicked even without prompt content
  const isGenerateButtonEnabled = true;

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <button className={styles.backButton} onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Atrás
        </button>
      </div>

      {/* Main Title */}
      <div className={styles.header}>
        <h1 className={styles.title}>{moduleEvaluation?.object_title || 'Evaluación'}</h1>
        <p className={styles.subtitle}>{moduleEvaluation?.learning_goal || ''}</p>
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
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setQuestionCount('');
                } else {
                  const numValue = parseInt(value);
                  if (!isNaN(numValue)) {
                    setQuestionCount(numValue);
                  }
                }
              }}
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
          <button
            className={styles.generateButton}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            {isGenerating ? "Generando..." : "Generar con IA"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationGeneration;
