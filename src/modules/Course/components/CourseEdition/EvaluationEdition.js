import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../../../shared/store/uiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faWandMagicSparkles,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import DeleteConfirmationPopup from "../../../../shared/components/DeleteConfirmationPopup";
import styles from "./EvaluationEdition.module.css";

const EvaluationEdition = ({
  moduleEvaluation,
  onBack,
  onSave,
  questions = [],
  onRegenerateEvaluation,
  onAddQuizAnswers,
  onUpdateQuizAnswers,
  onDeleteQuizAnswers,
  onAddQuizQuestions,
  onUpdateQuizQuestions,
  onDeleteQuizQuestions,
}) => {
  const dispatch = useDispatch();
  const [structureInput, setStructureInput] = useState("");
  const [editingQuestions, setEditingQuestions] = useState(questions);
  
  // Estados para agregar opciones (similar a CourseEvaluation)
  const [showAddOptionForm, setShowAddOptionForm] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [newAnswerText, setNewAnswerText] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  
  // Estados para editar opciones existentes
  const [showEditOptionForm, setShowEditOptionForm] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerText, setEditAnswerText] = useState("");
  const [editIsCorrectAnswer, setEditIsCorrectAnswer] = useState(false);
  
  // Estados para modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [answerToDelete, setAnswerToDelete] = useState(null);
  
  // Estados para editar preguntas
  const [showEditQuestionForm, setShowEditQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  
  // Estados para modal de confirmación de eliminación de preguntas
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  
  // Sincronizar editingQuestions cuando cambien las questions prop
  useEffect(() => {
    setEditingQuestions(questions);
  }, [questions]);
  
  console.log("questions", questions);
  const handleRegenerateStructure = async () => {
    if (!structureInput.trim()) {
      console.log("No structure input provided");
      return;
    }

    if (!onRegenerateEvaluation) {
      console.log("No regenerate function provided");
      return;
    }

    console.log("Regenerating structure with:", structureInput);

    // Crear el objeto de datos de evaluación similar al usado en EvaluationGeneration
    const evaluationData = {
      ActivityId: moduleEvaluation?.id,
      Prompt: structureInput,
      Multiple_Choise: true, // Por defecto, se puede hacer configurable más adelante
      Multiple_Select: false,
      True_False: false,
      Open_Question: false,
    };

    try {
      await onRegenerateEvaluation(evaluationData);
      // Limpiar el input después de regenerar exitosamente
      setStructureInput("");
    } catch (error) {
      console.error("Error regenerating evaluation:", error);
    }
  };

  // Funciones para agregar opciones (similar a CourseEvaluation)
  const handleAddOption = (questionId) => {
    setSelectedQuestionId(questionId);
    setNewAnswerText("");
    setIsCorrectAnswer(false);
    setShowAddOptionForm(true);
  };

  const handleSaveOption = async () => {
    if (newAnswerText.trim()) {
      dispatch(showLoading());
      try {
        const quizAnswerData = {
          QuestionsId: selectedQuestionId,
          answer: newAnswerText.trim(),
          isCorrect: isCorrectAnswer,
        };

        // Llamar a la función onAddQuizAnswers si está disponible
        if (onAddQuizAnswers) {
          await onAddQuizAnswers(quizAnswerData);
        }

        handleCancelOption();
      } catch (error) {
        console.error("Error adding option:", error);
        alert("Error al agregar la opción. Por favor, intenta de nuevo.");
      } finally {
        dispatch(hideLoading());
      }
    }
  };

  const handleCancelOption = () => {
    setShowAddOptionForm(false);
    setSelectedQuestionId(null);
    setNewAnswerText("");
    setIsCorrectAnswer(false);
  };

  // Funciones para editar opciones existentes
  const handleEditOption = (answer) => {
    setEditingAnswerId(answer.answerId);
    setEditAnswerText(answer.answer);
    setEditIsCorrectAnswer(answer.correct);
    setShowEditOptionForm(true);
    // Cerrar el formulario de agregar si está abierto
    setShowAddOptionForm(false);
  };

  const handleSaveEditOption = async () => {
    if (editAnswerText.trim() && editingAnswerId) {
      dispatch(showLoading());
      try {
        const quizAnswerData = {
          answer: editAnswerText.trim(),
        };

        // Llamar a la función onUpdateQuizAnswers si está disponible
        if (onUpdateQuizAnswers) {
          await onUpdateQuizAnswers(editingAnswerId, quizAnswerData);
        }

        handleCancelEditOption();
      } catch (error) {
        console.error("Error updating option:", error);
        alert("Error al actualizar la opción. Por favor, intenta de nuevo.");
      } finally {
        dispatch(hideLoading());
      }
    }
  };

  const handleCancelEditOption = () => {
    setShowEditOptionForm(false);
    setEditingAnswerId(null);
    setEditAnswerText("");
    setEditIsCorrectAnswer(false);
  };

  const handleDeleteOption = (answerId) => {
    setAnswerToDelete(answerId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (onDeleteQuizAnswers && answerToDelete) {
      dispatch(showLoading());
      try {
        // Actualizar UI localmente primero (optimistic update)
        setEditingQuestions(prevQuestions => 
          prevQuestions.map(question => ({
            ...question,
            answers: question.answers?.filter(answer => answer.answerId !== answerToDelete) || []
          }))
        );
        
        // Llamar al servicio para eliminar en el backend
        await onDeleteQuizAnswers(answerToDelete);
        
        console.log(`Answer with ID ${answerToDelete} deleted successfully`);
      } catch (error) {
        console.error("Error deleting answer:", error);
        // Revertir el cambio optimista en caso de error
        alert("Error al eliminar la opción. Por favor, recarga la página.");
      } finally {
        dispatch(hideLoading());
      }
    }
    
    // Cerrar modal y limpiar estado
    setShowDeleteModal(false);
    setAnswerToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setAnswerToDelete(null);
  };

  // Funciones para editar preguntas
  const handleEditQuestion = (question) => {
    setEditingQuestionId(question.questionId);
    setEditQuestionText(question.question);
    setShowEditQuestionForm(true);
    // Cerrar formularios de opciones si están abiertos
    setShowAddOptionForm(false);
    setShowEditOptionForm(false);
  };

  const handleSaveEditQuestion = async () => {
    if (editQuestionText.trim() && editingQuestionId) {
      dispatch(showLoading());
      try {
        const questionData = {
          question: editQuestionText.trim(),
        };

        // Actualizar UI localmente primero (optimistic update)
        setEditingQuestions(prevQuestions => 
          prevQuestions.map(q => 
            q.questionId === editingQuestionId 
              ? { ...q, question: editQuestionText.trim() }
              : q
          )
        );

        // Llamar al servicio para actualizar en el backend
        if (onUpdateQuizQuestions) {
          await onUpdateQuizQuestions(editingQuestionId, questionData);
        }

        handleCancelEditQuestion();
      } catch (error) {
        console.error("Error updating question:", error);
        // Revertir el cambio optimista en caso de error
        setEditingQuestions(prevQuestions => 
          prevQuestions.map(q => 
            q.questionId === editingQuestionId 
              ? { ...q, question: editQuestionText }
              : q
          )
        );
      } finally {
        dispatch(hideLoading());
      }
    }
  };

  const handleCancelEditQuestion = () => {
    setShowEditQuestionForm(false);
    setEditingQuestionId(null);
    setEditQuestionText("");
  };

  const handleDeleteQuestion = (questionId) => {
    console.log('handleDeleteQuestion called with ID:', questionId);
    console.log('Question object:', editingQuestions.find(q => q.questionId === questionId));
    setQuestionToDelete(questionId);
    setShowDeleteQuestionModal(true);
  };

  const handleConfirmDeleteQuestion = async () => {
    if (onDeleteQuizQuestions && questionToDelete) {
      dispatch(showLoading());
      try {
        // Actualizar UI localmente primero (optimistic update)
        const questionToDeleteCopy = questionToDelete;
        setEditingQuestions(prevQuestions => 
          prevQuestions.filter(q => q.questionId !== questionToDelete)
        );
        
        // Llamar al servicio para eliminar en el backend
        console.log('Calling onDeleteQuizQuestions with ID:', questionToDelete);
        await onDeleteQuizQuestions(questionToDelete);
        
        console.log(`Question with ID ${questionToDeleteCopy} deleted successfully`);
      } catch (error) {
        console.error("Error deleting question:", error);
        // Revertir el cambio optimista en caso de error
        // Necesitaríamos restaurar la pregunta, pero por simplicidad mostramos error
        alert("Error al eliminar la pregunta. Por favor, recarga la página.");
      } finally {
        dispatch(hideLoading());
      }
    }
    
    // Cerrar modal y limpiar estado
    setShowDeleteQuestionModal(false);
    setQuestionToDelete(null);
  };

  const handleCancelDeleteQuestion = () => {
    setShowDeleteQuestionModal(false);
    setQuestionToDelete(null);
  };

  // Función para determinar el tipo de pregunta basado en respuestas correctas
  const getQuestionType = (answers) => {
    if (!answers || answers.length === 0) return "multiple_choice";
    const correctCount = answers.filter((answer) => answer.correct).length;
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
            <div
              key={question.questionId || question.id || index}
              className={styles.questionCard}
            >
              <div className={styles.questionHeader}>
                <div className={styles.questionNumber}>{index + 1}</div>
                <div className={styles.questionActions}>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEditQuestion(question)}
                    title="Editar pregunta"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteQuestion(question.questionId)}
                    title="Eliminar pregunta"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>

              <div className={styles.questionContent}>
                {showEditQuestionForm && editingQuestionId === question.questionId ? (
                  // Formulario de edición de pregunta
                  <div className={styles.editQuestionForm}>
                    <div className={styles.formRow}>
                      <input
                        type="text"
                        className={styles.questionInput}
                        value={editQuestionText}
                        onChange={(e) => setEditQuestionText(e.target.value)}
                        placeholder="Texto de la pregunta"
                      />
                    </div>
                    <div className={styles.formButtons}>
                      <button
                        className={styles.saveBtn}
                        onClick={handleSaveEditQuestion}
                        disabled={!editQuestionText.trim()}
                      >
                        Guardar
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={handleCancelEditQuestion}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Vista normal de la pregunta
                  <p className={styles.questionText}>
                    {question.question ||
                      "¿Cuál es el concepto fundamental de la inteligencia artificial?"}
                  </p>
                )}

                <div className={styles.questionType}>
                  <select
                    className={styles.typeSelect}
                    value={getQuestionType(question.answers)}
                    disabled={true}
                    style={{ pointerEvents: "none" }}
                  >
                    <option value="multiple_choice">Opción única</option>
                    <option value="multiple_select">Opción múltiple</option>
                  </select>
                </div>

                <div className={styles.options}>
                  {question.answers?.map((answer, optIndex) => {
                    const questionType = getQuestionType(question.answers);
                    const inputType =
                      questionType === "multiple_select" ? "checkbox" : "radio";
                    const inputClass =
                      questionType === "multiple_select"
                        ? styles.optionCheckbox
                        : styles.optionRadio;

                    return (
                      <div key={answer.answerId} className={styles.option}>
                        {showEditOptionForm && editingAnswerId === answer.answerId ? (
                          // Formulario de edición
                          <div className={styles.addOptionForm}>
                            <div className={styles.formRow}>
                              <input
                                type="text"
                                className={styles.optionInput}
                                value={editAnswerText}
                                onChange={(e) => setEditAnswerText(e.target.value)}
                                placeholder="Texto de la opción"
                              />
                            </div>
                            <div className={styles.formButtons}>
                              <button
                                className={styles.saveBtn}
                                onClick={handleSaveEditOption}
                              >
                                Guardar
                              </button>
                              <button
                                className={styles.cancelBtn}
                                onClick={handleCancelEditOption}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Vista normal de la opción
                          <>
                            <input
                              type={inputType}
                              name={
                                inputType === "radio"
                                  ? `question-${question.questionId}`
                                  : undefined
                              }
                              id={`q${question.questionId}-opt${answer.answerId}`}
                              className={inputClass}
                              checked={answer.correct}
                              disabled={true}
                              style={{ pointerEvents: "none" }}
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
                            <div className={styles.optionActions}>
                              <button
                                className={styles.editOptionBtn}
                                onClick={() => handleEditOption(answer)}
                                title="Editar opción"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                className={styles.deleteOptionBtn}
                                onClick={() => handleDeleteOption(answer.answerId)}
                                title="Eliminar opción"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </>
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
                        {
                          answer: "Análisis de datos",
                          correct: false,
                          answerId: 3,
                        },
                      ];
                      const questionType = getQuestionType(fallbackAnswers);
                      const inputType =
                        questionType === "multiple_select"
                          ? "checkbox"
                          : "radio";
                      const inputClass =
                        questionType === "multiple_select"
                          ? styles.optionCheckbox
                          : styles.optionRadio;

                      return fallbackAnswers.map((answer, optIndex) => (
                        <div key={answer.answerId} className={styles.option}>
                          <input
                            type={inputType}
                            name={
                              inputType === "radio"
                                ? `question-${question.questionId || "default"}`
                                : undefined
                            }
                            id={`q${question.questionId || "default"}-opt${
                              answer.answerId
                            }`}
                            className={inputClass}
                            checked={answer.correct}
                            disabled={true}
                            style={{ pointerEvents: "none" }}
                            readOnly
                          />
                          <label
                            htmlFor={`q${question.questionId || "default"}-opt${
                              answer.answerId
                            }`}
                            className={styles.optionLabel}
                          >
                            {answer.answer}
                          </label>
                          {answer.correct && (
                            <span className={styles.correctBadge}>
                              Correcta
                            </span>
                          )}
                        </div>
                      ));
                    })()}

                  {/* Formulario para agregar opción (similar a CourseEvaluation) */}
                  {showAddOptionForm && selectedQuestionId === (question.questionId || question.id) && (
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

                  {/* Botón agregar opción (solo se muestra cuando no hay formulario activo) */}
                  {(!showAddOptionForm || selectedQuestionId !== (question.questionId || question.id)) && (
                    <button
                      className={styles.addOptionButton}
                      onClick={() => handleAddOption(question.questionId || question.id)}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Agregar opción
                    </button>
                  )}
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

                {/* Formulario para agregar opción en pregunta de ejemplo */}
                {showAddOptionForm && selectedQuestionId === "example-1" && (
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
                          id="isCorrectExample"
                          checked={isCorrectAnswer}
                          onChange={(e) => setIsCorrectAnswer(e.target.checked)}
                          className={styles.correctCheckbox}
                        />
                        <label htmlFor="isCorrectExample">Respuesta correcta</label>
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

                {/* Botón agregar opción para pregunta de ejemplo */}
                {(!showAddOptionForm || selectedQuestionId !== "example-1") && (
                  <button
                    className={styles.addOptionButton}
                    onClick={() => handleAddOption("example-1")}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Agregar opción
                  </button>
                )}
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
      
      {/* Modal de confirmación de eliminación de opciones */}
      <DeleteConfirmationPopup
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar opción"
        message="¿Estás seguro de que quieres eliminar esta opción? Esta acción no se puede deshacer."
      />
      
      {/* Modal de confirmación de eliminación de preguntas */}
      <DeleteConfirmationPopup
        isOpen={showDeleteQuestionModal}
        onClose={handleCancelDeleteQuestion}
        onConfirm={handleConfirmDeleteQuestion}
        title="Eliminar pregunta"
        message="¿Estás seguro de que quieres eliminar esta pregunta? Se eliminarán también todas sus opciones. Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default EvaluationEdition;
