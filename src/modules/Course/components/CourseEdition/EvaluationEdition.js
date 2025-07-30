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
  quizzesId,
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

  // Estados para crear nueva pregunta
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "multiple", // "multiple" or "single"
    answers: [],
  });
  const [newQuestionAnswerText, setNewQuestionAnswerText] = useState("");
  const [newQuestionIsCorrect, setNewQuestionIsCorrect] = useState(false);
  const [floatingError, setFloatingError] = useState("");
  const [showFloatingError, setShowFloatingError] = useState(false);

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
        setEditingQuestions((prevQuestions) =>
          prevQuestions.map((question) => ({
            ...question,
            answers:
              question.answers?.filter(
                (answer) => answer.answerId !== answerToDelete
              ) || [],
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
        setEditingQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
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
        setEditingQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
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
    console.log("handleDeleteQuestion called with ID:", questionId);
    console.log(
      "Question object:",
      editingQuestions.find((q) => q.questionId === questionId)
    );
    setQuestionToDelete(questionId);
    setShowDeleteQuestionModal(true);
  };

  const handleConfirmDeleteQuestion = async () => {
    if (onDeleteQuizQuestions && questionToDelete) {
      dispatch(showLoading());
      try {
        // Actualizar UI localmente primero (optimistic update)
        const questionToDeleteCopy = questionToDelete;
        setEditingQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q.questionId !== questionToDelete)
        );

        // Llamar al servicio para eliminar en el backend
        console.log("Calling onDeleteQuizQuestions with ID:", questionToDelete);
        await onDeleteQuizQuestions(questionToDelete);

        console.log(
          `Question with ID ${questionToDeleteCopy} deleted successfully`
        );
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
    setShowNewQuestionForm(true);
    setNewQuestion({
      text: "",
      type: "multiple",
      answers: [],
    });
  };

  // Funciones para crear nueva pregunta
  const handleNewQuestionTypeChange = (type) => {
    // Si está cambiando a opción única, verificar que no haya múltiples respuestas correctas
    if (type === "single") {
      const correctAnswersCount = newQuestion.answers.filter(
        (answer) => answer.correct
      ).length;
      if (correctAnswersCount > 1) {
        // Mostrar error flotante
        setFloatingError(
          "Debe haber solo una respuesta correcta para cambiar a opción única"
        );
        setShowFloatingError(true);

        // Ocultar el error después de 3 segundos
        setTimeout(() => {
          setShowFloatingError(false);
        }, 3000);

        return; // No cambiar el tipo
      }
    }

    setNewQuestion((prev) => ({
      ...prev,
      type,
      answers: prev.answers.map((answer) => ({
        ...answer,
        correct: type === "single" ? false : answer.correct,
      })),
    }));
  };

  const handleAddNewQuestionAnswer = () => {
    if (newQuestionAnswerText.trim()) {
      const newAnswer = {
        id: Date.now(),
        text: newQuestionAnswerText.trim(),
        correct: newQuestionIsCorrect,
      };

      setNewQuestion((prev) => ({
        ...prev,
        answers: [...prev.answers, newAnswer],
      }));

      setNewQuestionAnswerText("");
      setNewQuestionIsCorrect(false);
    }
  };

  const handleRemoveNewQuestionAnswer = (answerId) => {
    setNewQuestion((prev) => ({
      ...prev,
      answers: prev.answers.filter((answer) => answer.id !== answerId),
    }));
  };

  const handleNewQuestionAnswerCorrectChange = (answerId, isCorrect) => {
    setNewQuestion((prev) => ({
      ...prev,
      answers: prev.answers.map((answer) => {
        if (newQuestion.type === "single") {
          // Para opción única, solo una puede ser correcta
          return {
            ...answer,
            correct: answer.id === answerId ? isCorrect : false,
          };
        } else {
          // Para opción múltiple, múltiples pueden ser correctas
          return answer.id === answerId
            ? { ...answer, correct: isCorrect }
            : answer;
        }
      }),
    }));
  };

  const handleSaveNewQuestion = async () => {
    // Función helper para mostrar error flotante
    const showFloatingErrorMessage = (message) => {
      setFloatingError(message);
      setShowFloatingError(true);
      setTimeout(() => {
        setShowFloatingError(false);
      }, 4000);
    };

    // Validación: texto de pregunta y al menos una opción
    if (!newQuestion.text.trim() || newQuestion.answers.length === 0) {
      showFloatingErrorMessage(
        "Por favor, ingresa el texto de la pregunta y al menos una opción."
      );
      return;
    }

    // Validación: al menos una respuesta correcta
    if (!newQuestion.answers.some((answer) => answer.correct)) {
      showFloatingErrorMessage(
        "Por favor, marca al menos una respuesta como correcta."
      );
      return;
    }

    // Validación: al menos una respuesta incorrecta
    if (!newQuestion.answers.some((answer) => !answer.correct)) {
      showFloatingErrorMessage(
        "Por favor, debe haber al menos una respuesta incorrecta."
      );
      return;
    }

    dispatch(showLoading());
    try {
      // Primero crear la pregunta
      // Usar quizzesId pasado como prop, con fallback a moduleEvaluation si no está disponible
      const targetQuizzesId =
        quizzesId ||
        (questions.length > 0 ? questions[0]?.quizzesId : null) ||
        moduleEvaluation?.quizzesId ||
        moduleEvaluation?.id;
      const questionData = {
        quizzesId: targetQuizzesId,
        question: newQuestion.text.trim(),
      };

      if (onAddQuizQuestions) {
        const createdQuestion = await onAddQuizQuestions(questionData);

        // Intentar diferentes estructuras de respuesta
        const questionId =
          createdQuestion?.id ||
          createdQuestion?.data?.id ||
          createdQuestion?.questionId ||
          createdQuestion?.data?.questionId;

        // Luego crear todas las respuestas vinculadas a la pregunta
        if (createdQuestion && questionId) {
          // Crear todas las respuestas secuencialmente
          for (let i = 0; i < newQuestion.answers.length; i++) {
            const answer = newQuestion.answers[i];
            const answerData = {
              QuestionsId: questionId,
              answer: answer.text.trim(),
              isCorrect: answer.correct,
            };
            await onAddQuizAnswers(answerData);
          }
        } else {
          showFloatingErrorMessage(
            "Error al crear la pregunta. Por favor, intenta de nuevo."
          );
          return;
        }
      } else {
        showFloatingErrorMessage(
          "Error al crear la pregunta. Por favor, intenta de nuevo."
        );
        return;
      }

      // Resetear el formulario solo si todo fue exitoso
      handleCancelNewQuestion();
    } catch (error) {
      showFloatingErrorMessage(
        "Error al crear la pregunta. Por favor, intenta de nuevo."
      );
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleCancelNewQuestion = () => {
    setShowNewQuestionForm(false);
    setNewQuestion({
      text: "",
      type: "multiple",
      answers: [],
    });
    setNewQuestionAnswerText("");
    setNewQuestionIsCorrect(false);
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
                {showEditQuestionForm &&
                editingQuestionId === question.questionId ? (
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
                        {showEditOptionForm &&
                        editingAnswerId === answer.answerId ? (
                          // Formulario de edición
                          <div className={styles.addOptionForm}>
                            <div className={styles.formRow}>
                              <input
                                type="text"
                                className={styles.optionInput}
                                value={editAnswerText}
                                onChange={(e) =>
                                  setEditAnswerText(e.target.value)
                                }
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
                              <span className={styles.correctBadge}>
                                Correcta
                              </span>
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
                                onClick={() =>
                                  handleDeleteOption(answer.answerId)
                                }
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
                  {showAddOptionForm &&
                    selectedQuestionId ===
                      (question.questionId || question.id) && (
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
                              onChange={(e) =>
                                setIsCorrectAnswer(e.target.checked)
                              }
                              className={styles.correctCheckbox}
                            />
                            <label htmlFor="isCorrect">
                              Respuesta correcta
                            </label>
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
                  {(!showAddOptionForm ||
                    selectedQuestionId !==
                      (question.questionId || question.id)) && (
                    <button
                      className={styles.addOptionButton}
                      onClick={() =>
                        handleAddOption(question.questionId || question.id)
                      }
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
                        <label htmlFor="isCorrectExample">
                          Respuesta correcta
                        </label>
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

      {/* New Question Creation Form */}
      {showNewQuestionForm && (
        <div className={styles.questionCard}>
          <div className={styles.questionHeader}>
            <span className={styles.questionNumber}>Nueva</span>
          </div>

          {/* Floating Error Message */}
          {showFloatingError && (
            <div className={styles.floatingError}>{floatingError}</div>
          )}

          <div className={styles.questionContent}>
            {/* Question Text Input */}
            <div className={styles.questionTextContainer}>
              <input
                type="text"
                placeholder="Ingrese la pregunta aquí"
                value={newQuestion.text}
                onChange={(e) =>
                  setNewQuestion((prev) => ({ ...prev, text: e.target.value }))
                }
                className={styles.questionInput}
              />
            </div>

            {/* Question Type Dropdown */}
            <div className={styles.questionType}>
              <select
                className={styles.typeSelect}
                value={
                  newQuestion.type === "multiple"
                    ? "multiple_select"
                    : "multiple_choice"
                }
                onChange={(e) =>
                  handleNewQuestionTypeChange(
                    e.target.value === "multiple_select" ? "multiple" : "single"
                  )
                }
              >
                <option value="multiple_choice">Opción única</option>
                <option value="multiple_select">Opción múltiple</option>
              </select>
            </div>

            {/* Answers List */}
            <div className={styles.options}>
              {newQuestion.answers.map((answer) => (
                <div key={answer.id} className={styles.option}>
                  {newQuestion.type === "single" ? (
                    <input
                      type="radio"
                      name="new-question-answers"
                      checked={answer.correct}
                      onChange={(e) =>
                        handleNewQuestionAnswerCorrectChange(
                          answer.id,
                          e.target.checked
                        )
                      }
                      className={styles.optionRadio}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={answer.correct}
                      onChange={(e) =>
                        handleNewQuestionAnswerCorrectChange(
                          answer.id,
                          e.target.checked
                        )
                      }
                      className={styles.optionCheckbox}
                    />
                  )}
                  <label className={styles.optionLabel}>{answer.text}</label>
                  {answer.correct && (
                    <span className={styles.correctBadge}>Correcta</span>
                  )}
                  <button
                    className={styles.deleteOptionBtn}
                    onClick={() => handleRemoveNewQuestionAnswer(answer.id)}
                    title="Eliminar opción"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}

              {/* Add New Answer Form */}
              <div className={styles.addOptionForm}>
                <div className={styles.formRow}>
                  <input
                    type="text"
                    placeholder="Texto de la nueva opción"
                    value={newQuestionAnswerText}
                    onChange={(e) => setNewQuestionAnswerText(e.target.value)}
                    className={styles.optionInput}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddNewQuestionAnswer();
                      }
                    }}
                  />
                  <div className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      id="newQuestionCorrect"
                      checked={newQuestionIsCorrect}
                      onChange={(e) =>
                        setNewQuestionIsCorrect(e.target.checked)
                      }
                      className={styles.correctCheckbox}
                    />
                    <label htmlFor="newQuestionCorrect">
                      Respuesta correcta
                    </label>
                  </div>
                </div>
                <div className={styles.formButtons}>
                  <button
                    className={styles.saveBtn}
                    onClick={handleAddNewQuestionAnswer}
                    disabled={!newQuestionAnswerText.trim()}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            <div className={styles.newQuestionActions}>
              <button
                className={styles.saveBtn}
                onClick={handleSaveNewQuestion}
                disabled={
                  !newQuestion.text.trim() || newQuestion.answers.length === 0
                }
              >
                Guardar
              </button>
              <button
                className={styles.cancelBtn}
                onClick={handleCancelNewQuestion}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Question Button */}
      {!showNewQuestionForm && (
        <div className={styles.addQuestionSection}>
          <button
            className={styles.addQuestionButton}
            onClick={handleAddQuestion}
          >
            <FontAwesomeIcon icon={faPlus} />
            Agregar nueva pregunta
          </button>
        </div>
      )}

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
