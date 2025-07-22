import React, { useState, useEffect } from "react";
import styles from "./CourseEvaluation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPlus,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

const CourseEvaluation = ({
  moduleEvaluation,
  onGenerateEvaluation,
  onRegenerateEvaluation,
  onAddQuizAnswers,
  generatedQuestions,
  existingQuestions,
}) => {
  console.log("CourseEvaluation", moduleEvaluation);
  const [questions, setQuestions] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState(
    moduleEvaluation?.estimated_time || 15
  );
  const [minScore, setMinScore] = useState(70);
  const [randomQuestions, setRandomQuestions] = useState(false);
  const [showAddOptionForm, setShowAddOptionForm] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [newAnswerText, setNewAnswerText] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  useEffect(() => {
    let questionsToDisplay = null;

    if (generatedQuestions && generatedQuestions.length > 0) {
      questionsToDisplay = generatedQuestions;
    } else if (existingQuestions && existingQuestions.length > 0) {
      questionsToDisplay = existingQuestions;
    } else if (moduleEvaluation?.quizData) {
      try {
        questionsToDisplay = JSON.parse(moduleEvaluation.quizData).questions;
      } catch (error) {
        console.error("Error parsing quizData:", error);
        questionsToDisplay = [];
      }
    }

    if (questionsToDisplay && Array.isArray(questionsToDisplay)) {
      const transformedQuestions = questionsToDisplay.map((q, index) => ({
        id: q.questionId || `q-${index}`,
        text: q.question,
        type: "checkbox",
        points: 1,
        options: q.answers.map((answer, aIndex) => ({
          id: answer.answerId || `a-${index}-${aIndex}`,
          text: answer.answer,
          checked: answer.correct,
        })),
      }));
      setQuestions(transformedQuestions);
    } else {
      setQuestions([]);
    }
  }, [moduleEvaluation?.quizData, generatedQuestions, existingQuestions]);

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

  const handleAddOption = (questionId) => {
    setSelectedQuestionId(questionId);
    setNewAnswerText("");
    setIsCorrectAnswer(false);
    setShowAddOptionForm(true);
  };

  const handleSaveOption = () => {
    if (newAnswerText.trim()) {
      const quizAnswerData = {
        QuestionsId: selectedQuestionId,
        answer: newAnswerText.trim(),
        isCorrect: isCorrectAnswer
      };
      
      if (onAddQuizAnswers) {
        onAddQuizAnswers(quizAnswerData);
      }
      
      handleCancelOption();
    }
  };

  const handleCancelOption = () => {
    setShowAddOptionForm(false);
    setSelectedQuestionId(null);
    setNewAnswerText("");
    setIsCorrectAnswer(false);
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
              <FontAwesomeIcon icon={faEye} /> Visualizar
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
                {showAddOptionForm && selectedQuestionId === q.id && (
                  <div className={styles.addOptionForm}>
                    <div className={styles.formRow}>
                      <input
                        type="text"
                        placeholder="Texto de la nueva opción"
                        value={newAnswerText}
                        onChange={(e) => setNewAnswerText(e.target.value)}
                        className={styles.optionInput}
                      />
                      <div className={styles.checkboxContainer}>
                        <input
                          type="checkbox"
                          id="isCorrect"
                          checked={isCorrectAnswer}
                          onChange={(e) => setIsCorrectAnswer(e.target.checked)}
                          className={styles.correctCheckbox}
                        />
                        <label htmlFor="isCorrect">Respuesta correcta</label>
                      </div>
                    </div>
                    <div className={styles.formButtons}>
                      <button 
                        className={styles.saveBtn}
                        onClick={handleSaveOption}
                        disabled={!newAnswerText.trim()}
                      >
                        Guardar
                      </button>
                      <button 
                        className={styles.cancelBtn}
                        onClick={handleCancelOption}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {(!showAddOptionForm || selectedQuestionId !== q.id) && (
                <button 
                  className={styles.addOptionBtn}
                  onClick={() => handleAddOption(q.id)}
                >
                  <FontAwesomeIcon icon={faPlus} /> Agregar opción
                </button>
              )}
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
        <button className={styles.generateAIBtn} onClick={handleGenerateWithAI}>
          <FontAwesomeIcon icon={faWandMagicSparkles} />{" "}
          {questions.length > 0 ? "Regenerar con IA" : "Generar con IA"}
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
