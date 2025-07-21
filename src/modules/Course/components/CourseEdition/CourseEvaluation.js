import React, { useState, useEffect } from "react";
import styles from "./CourseEvaluation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faSave,
  faPlus,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

const CourseEvaluation = ({
  moduleEvaluation,
  onCreateEvaluationQuiz,
  onGenerateEvaluation,
  onRegenerateEvaluation,
  generatedQuestions,
}) => {
  console.log("CourseEvaluation", moduleEvaluation);
  const [questions, setQuestions] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState(
    moduleEvaluation?.estimated_time || 15
  );
  const [minScore, setMinScore] = useState(70);
  const [randomQuestions, setRandomQuestions] = useState(false);

  useEffect(() => {
    // Priority 1: Use generated questions from API response
    if (generatedQuestions && Array.isArray(generatedQuestions)) {
      // Transform API response format to component format
      const transformedQuestions = generatedQuestions.map((q) => ({
        id: q.questionId,
        text: q.question,
        type: "checkbox", // Multiple choice with multiple correct answers
        points: 1, // Default points
        options: q.answers.map((answer) => ({
          id: answer.answerId,
          text: answer.answer,
          checked: answer.correct,
        })),
      }));
      setQuestions(transformedQuestions);
    }
    // Priority 2: Use existing module content
    else if (moduleEvaluation?.content && moduleEvaluation.content.length > 0) {
      try {
        const parsedQuestions = JSON.parse(moduleEvaluation.content[0]);
        setQuestions(Array.isArray(parsedQuestions) ? parsedQuestions : []);
      } catch (error) {
        console.error("Error parsing questions from module content:", error);
        setQuestions([]);
      }
    } else {
      setQuestions([]);
    }
  }, [moduleEvaluation, generatedQuestions]);

  const handleSave = () => {
    const evaluationData = {
      QuizData: JSON.stringify(questions),
      ActivityId: moduleEvaluation.id, // Link quiz to the learning object
    };
    onCreateEvaluationQuiz(evaluationData);
  };

  const handleGenerateWithAI = () => {
    const evaluationData = {
      ActivityId: moduleEvaluation.id,
      Prompt: "",
      Multiple_Choise: true,
      Cant_Answers: 5,
    };
    if (questions.length > 0) {
      onRegenerateEvaluation(evaluationData);
    } else {
      onGenerateEvaluation(evaluationData);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              {moduleEvaluation?.object_title || "Evaluación del Módulo"}
            </h2>
            <p className={styles.subtitle}>
              {moduleEvaluation?.learning_goal ||
                "Añade preguntas para evaluar la comprensión del módulo por parte del estudiante."}
            </p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.previewBtn}>
              <FontAwesomeIcon icon={faEye} /> Preview
            </button>
            <button className={styles.saveBtn} onClick={handleSave}>
              <FontAwesomeIcon icon={faSave} /> Save
            </button>
          </div>
        </div>

        {questions.length > 0 ? (
          questions.map((q) => (
            <div key={q.id} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <p className={styles.questionText}>{q.text}</p>
                <input
                  type="text"
                  className={styles.pointsInput}
                  defaultValue={`${q.points} pts`}
                />
              </div>
              <div className={styles.optionsContainer}>
                {q.options.map((opt) => (
                  <div key={opt.id} className={styles.option}>
                    <input
                      type={q.type}
                      id={`q${q.id}-opt${opt.id}`}
                      name={`question-${q.id}`}
                      defaultChecked={opt.checked}
                    />
                    <label htmlFor={`q${q.id}-opt${opt.id}`}>{opt.text}</label>
                  </div>
                ))}
              </div>
              <a className={styles.addOptionLink}>
                <FontAwesomeIcon icon={faPlus} /> Add option
              </a>
            </div>
          ))
        ) : (
          <div className={styles.noQuestions}>
            <p>No hay preguntas en esta evaluación.</p>
            <p>Puedes agregarlas manualmente o generarlas con IA.</p>
          </div>
        )}
      </div>

      <div className={styles.sidebar}>
        <button className={styles.addQuestionBtn}>
          <FontAwesomeIcon icon={faPlus} /> Agregar pregunta
        </button>
        <button 
          className={styles.generateAIBtn} 
          onClick={handleGenerateWithAI}
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} />{" "}
          {questions.length > 0 
            ? "Regenerar con IA" 
            : "Generar con IA"
          }
        </button>

        <div className={styles.configBox}>
          <h3 className={styles.configTitle}>Configuración</h3>
          <div className={styles.configItem}>
            <div className={styles.configCheckbox}>
              <input
                type="checkbox"
                id="random-questions"
                checked={randomQuestions}
                onChange={(e) => setRandomQuestions(e.target.checked)}
              />
              <label htmlFor="random-questions">Preguntas aleatorias</label>
            </div>
          </div>
          <div className={styles.configItem}>
            <label htmlFor="time-limit">Tiempo estimado</label>
            <input
              type="text"
              id="time-limit"
              value={`${estimatedTime} minutos`}
              onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className={styles.configItem}>
            <label htmlFor="min-score">Puntaje mínimo</label>
            <input
              type="text"
              id="min-score"
              value={`${minScore}%`}
              onChange={(e) => setMinScore(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEvaluation;
