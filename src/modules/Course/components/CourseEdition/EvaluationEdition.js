import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faWandMagicSparkles,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./EvaluationEdition.module.css";

const EvaluationEdition = ({
  moduleEvaluation,
  onBack,
  onSave,
  questions = [],
}) => {
  const [structureInput, setStructureInput] = useState("");
  const [editingQuestions, setEditingQuestions] = useState(questions);
  console.log("questions", questions);
  const handleRegenerateStructure = () => {
    console.log("Regenerating structure with:", structureInput);
    // Aquí se llamaría a la función para regenerar la estructura
  };

  // Función para determinar el tipo de pregunta basado en respuestas correctas
  const getQuestionType = (answers) => {
    if (!answers || answers.length === 0) return "multiple_choice";
    const correctCount = answers.filter(answer => answer.correct).length;
    return correctCount > 1 ? "multiple_select" : "multiple_choice";
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      questionId: Date.now(),
      question: "",
      answers: [
        { answerId: Date.now() + 1, answer: "", correct: false },
        { answerId: Date.now() + 2, answer: "", correct: false },
        { answerId: Date.now() + 3, answer: "", correct: true },
      ],
    };
    setEditingQuestions([...editingQuestions, newQuestion]);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editingQuestions);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Atrás
        </button>
        <button className={styles.saveButton} onClick={handleSave}>
          Guardar
        </button>
      </div>

      {/* Title Section */}
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          {moduleEvaluation?.object_title || "Evaluación diagnóstica"}
        </h1>
        <p className={styles.subtitle}>
          {moduleEvaluation?.learning_goal ||
            "Agregue preguntas para evaluar la comprensión de los estudiantes de este módulo."}
        </p>
      </div>

      {/* Structure Modification Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Modificar la estructura de la evaluación
        </h2>
        <div className={styles.structureRow}>
          <input
            type="text"
            className={styles.structureInput}
            placeholder="Describe cómo quieres reestructurar tu evaluación..."
            value={structureInput}
            onChange={(e) => setStructureInput(e.target.value)}
          />
          <button
            className={styles.regenerateButton}
            onClick={handleRegenerateStructure}
            disabled={!structureInput.trim()}
          >
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            Regenerar estructura
          </button>
        </div>
      </div>

      {/* Questions Section */}
      <div className={styles.questionsSection}>
        {editingQuestions.length > 0 ? (
          editingQuestions.map((question, index) => (
            <div key={question.questionId || question.id || index} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <div className={styles.questionNumber}>{index + 1}</div>
                <div className={styles.questionActions}>
                  <button className={styles.editButton}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className={styles.deleteButton}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>

              <div className={styles.questionContent}>
                <p className={styles.questionText}>
                  {question.question ||
                    "¿Cuál es el concepto fundamental de la inteligencia artificial?"}
                </p>

                <div className={styles.questionType}>
                  <select
                    className={styles.typeSelect}
                    value={getQuestionType(question.answers)}
                    disabled={true}
                    style={{ pointerEvents: 'none' }}
                  >
                    <option value="multiple_choice">Opción única</option>
                    <option value="multiple_select">Opción múltiple</option>
                    <option value="true_false">Verdadero/Falso</option>
                  </select>
                </div>

                <div className={styles.options}>
                  {question.answers?.map((answer, optIndex) => {
                    const questionType = getQuestionType(question.answers);
                    const inputType = questionType === "multiple_select" ? "checkbox" : "radio";
                    const inputClass = questionType === "multiple_select" ? styles.optionCheckbox : styles.optionRadio;
                    
                    return (
                      <div key={answer.answerId} className={styles.option}>
                        <input
                          type={inputType}
                          name={inputType === "radio" ? `question-${question.questionId}` : undefined}
                          id={`q${question.questionId}-opt${answer.answerId}`}
                          className={inputClass}
                          checked={answer.correct}
                          disabled={true}
                          style={{ pointerEvents: 'none' }}
                          readOnly
                        />
                        <label
                          htmlFor={`q${question.questionId}-opt${answer.answerId}`}
                          className={styles.optionLabel}
                        >
                          {answer.answer}
                        </label>
                        {answer.correct && (
                          <span className={styles.correctBadge}>Correcta</span>
                        )}
                      </div>
                    );
                  }) ||
                    // Fallback data if no answers exist
                    (() => {
                      const fallbackAnswers = [
                        {
                          answer: "Simulación de procesos cognitivos humanos",
                          correct: true,
                          answerId: 1,
                        },
                        {
                          answer: "Programación de computadoras",
                          correct: false,
                          answerId: 2,
                        },
                        { answer: "Análisis de datos", correct: false, answerId: 3 },
                      ];
                      const questionType = getQuestionType(fallbackAnswers);
                      const inputType = questionType === "multiple_select" ? "checkbox" : "radio";
                      const inputClass = questionType === "multiple_select" ? styles.optionCheckbox : styles.optionRadio;
                      
                      return fallbackAnswers.map((answer, optIndex) => (
                        <div key={answer.answerId} className={styles.option}>
                          <input
                            type={inputType}
                            name={inputType === "radio" ? `question-${question.questionId || 'default'}` : undefined}
                            id={`q${question.questionId || 'default'}-opt${answer.answerId}`}
                            className={inputClass}
                            checked={answer.correct}
                            disabled={true}
                            style={{ pointerEvents: 'none' }}
                            readOnly
                          />
                          <label
                            htmlFor={`q${question.questionId || 'default'}-opt${answer.answerId}`}
                            className={styles.optionLabel}
                          >
                            {answer.answer}
                          </label>
                          {answer.correct && (
                            <span className={styles.correctBadge}>Correcta</span>
                          )}
                        </div>
                      ));
                    })()}

                  <button className={styles.addOptionButton}>
                    + Agregar opción
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.questionCard}>
            <div className={styles.questionHeader}>
              <div className={styles.questionNumber}>1</div>
              <div className={styles.questionActions}>
                <button className={styles.editButton}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className={styles.deleteButton}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>

            <div className={styles.questionContent}>
              <p className={styles.questionText}>
                ¿Cuál es el concepto fundamental de la inteligencia artificial?
              </p>

              <div className={styles.questionType}>
                <select
                  className={styles.typeSelect}
                  defaultValue="multiple_choice"
                >
                  <option value="multiple_choice">Opción única</option>
                  <option value="multiple_select">Opción múltiple</option>
                  <option value="true_false">Verdadero/Falso</option>
                </select>
              </div>

              <div className={styles.options}>
                <div className={styles.option}>
                  <input
                    type="radio"
                    name="question-1"
                    id="q1-opt1"
                    className={styles.optionRadio}
                  />
                  <label htmlFor="q1-opt1" className={styles.optionLabel}>
                    Simulación de procesos cognitivos humanos
                  </label>
                  <span className={styles.correctBadge}>Correcta</span>
                </div>

                <div className={styles.option}>
                  <input
                    type="radio"
                    name="question-1"
                    id="q1-opt2"
                    className={styles.optionRadio}
                  />
                  <label htmlFor="q1-opt2" className={styles.optionLabel}>
                    Programación de computadoras
                  </label>
                </div>

                <div className={styles.option}>
                  <input
                    type="radio"
                    name="question-1"
                    id="q1-opt3"
                    className={styles.optionRadio}
                  />
                  <label htmlFor="q1-opt3" className={styles.optionLabel}>
                    Análisis de datos
                  </label>
                </div>

                <button className={styles.addOptionButton}>
                  + Agregar opción
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add New Question Button */}
      <div className={styles.addQuestionSection}>
        <button
          className={styles.addQuestionButton}
          onClick={handleAddQuestion}
        >
          <FontAwesomeIcon icon={faPlus} />
          Agregar nueva pregunta
        </button>
      </div>
    </div>
  );
};

export default EvaluationEdition;
