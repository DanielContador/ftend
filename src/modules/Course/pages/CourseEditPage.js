import React, { useState, useEffect } from "react";
import CourseEdition from "../components/CourseEdition/CourseEdition";
import CourseSectionActivity from "../components/CourseEdition/CourseSectionActivity";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import quizzesService from "../services/quizzesService";
import quizzesAnswersService from "../services/quizzesAnswersService";
import courseService from "../services/courseService";
import courseContentAIService from "../services/courseContentAIService";
import quizzesGeneratorService from "../services/quizzesGeneratorService";
import { useCrudManager } from "../../../shared/hooks/useCrudManager";
import {
  updateActivityTitle,
  deleteActivity,
} from "../services/courseStructureService";
import { useDispatch } from "react-redux";
import { setEditType } from "../../../shared/store/rootActions";
import { showLoading, hideLoading } from "../../../shared/store/uiSlice";

const CourseEditPage = ({
  handleError,
  showSection,
  onContinue,
  selectedTab,
  setSelectedTab,
  onEvaluationStatusChange,
  triggerEvaluationView,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { courseId } = router.query;
  const [courseStructure, setCourseStructure] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [existingQuestions, setExistingQuestions] = useState(null);

  const dispatch = useDispatch();
  const crud = useCrudManager(courseService, handleError, t, {
    fetchOnMount: false,
  });

  const handleRegenerate = async (instructions, courseId) => {
    dispatch(showLoading());
    try {
      const promptInstructionsData = {
        prompt: instructions,
        courseId: courseId,
      };
      await courseContentAIService.reGenerateCourseStructure(
        promptInstructionsData,
        "/regenerate-course-structure"
      );
      fetchCourseStructure();
    } catch (error) {
      console.error("Error regenerating course structure:", error);
      handleError(t("regenerateCourseStructureError"));
    } finally {
      dispatch(hideLoading());
    }
  };

  const fetchCourseStructure = async () => {
    if (courseId) {
      dispatch(showLoading());
      try {
        const data = await courseContentAIService.getCourseStructure(
          courseId,
          "/course-structure"
        );
        // --- NUEVO: Detectar si es material por la query ---
        const queryString =
          typeof window !== "undefined" ? window.location.search : "";
        const queryParam = queryString
          ? queryString.substring(1).toLowerCase()
          : "";
        if (queryParam === "material") {
          dispatch(setEditType("material"));
          // Redirigir a la edición de la actividad principal
          const modules = data.courseStructure?.modules || [];
          let activityId = null;
          let format = null;
          if (
            modules.length > 0 &&
            modules[0].learning_objects &&
            modules[0].learning_objects.length > 0
          ) {
            activityId = modules[0].learning_objects[0].id;
            format = modules[0].learning_objects[0].format;
          }
          if (activityId && format) {
            router.replace(
              `/course/${courseId}/edit/activity/?id=${activityId}&format=${format}`
            );
            return;
          }
        } else {
          dispatch(setEditType("course"));
        }
        // --- FIN NUEVO ---
        setCourseStructure(data.courseStructure);
      } catch (error) {
        console.error("Error fetching course structure:", error);
        handleError(t("fetchCourseStructureError"));
      } finally {
        dispatch(hideLoading());
      }
    }
  };

  const handleDeleteActivity = async (activityId) => {
    dispatch(showLoading());
    try {
      await deleteActivity("activity", activityId);
      fetchCourseStructure();
    } catch (error) {
      console.error("Error deleting activity:", error);
      handleError(t("deleteActivityError"));
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleUpdateActivityTitle = async (text, activityId) => {
    dispatch(showLoading());
    try {
      const activityData = {
        name: text,
      };
      await updateActivityTitle("activity", activityId, activityData);
      fetchCourseStructure();
    } catch (error) {
      console.error("Error updating activity title:", error);
      handleError(t("updateActivityTitleError"));
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleFetchQuizzes = async (activityId) => {
    if (!activityId) return;
    dispatch(showLoading());
    try {
      const response = await quizzesService.getQuizzesByActivityId(activityId);
      console.log("Quizzes response:", response);
      if (response && response.data) {
        setExistingQuestions(response.data.questions);
      } else {
        setExistingQuestions([]);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setExistingQuestions([]);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleGenerateEvaluation = async (evaluationData) => {
    dispatch(showLoading());
    try {
      const response = await quizzesGeneratorService.generateQuiz(
        evaluationData
      );
      console.log("Generating evaluation with data:", evaluationData);

      if (response && response.data && response.data.questions) {
        setGeneratedQuestions(response.data.questions);
      }

      fetchCourseStructure();
    } catch (error) {
      console.error("Error generating evaluation:", error);
      handleError("Error al generar la evaluación con IA.");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleRegenerateEvaluation = async (evaluationData) => {
    dispatch(showLoading());
    try {
      const response = await quizzesGeneratorService.regenerateQuiz(
        evaluationData
      );
      console.log("Regenerating evaluation with data:", evaluationData);

      if (response && response.data && response.data.questions) {
        setGeneratedQuestions(response.data.questions);
        // También actualizar las preguntas existentes para que se reflejen inmediatamente
        setExistingQuestions(response.data.questions);
      }

      // No llamar fetchCourseStructure() para evitar resetear el estado de navegación
      // fetchCourseStructure();
    } catch (error) {
      console.error("Error regenerating evaluation:", error);
      handleError("Error al regenerar la evaluación con IA.");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleAddQuizAnswers = async (quizAnswerData, activityId) => {
    dispatch(showLoading());
    try {
      const response = await quizzesAnswersService.addQuizAnswers(
        quizAnswerData
      );
      console.log("Adding quiz answer with data:", quizAnswerData);

      if (response) {
        console.log("Quiz answer added successfully:", response);
        console.log("Activity ID:", activityId);
        if (activityId) {
          handleFetchQuizzes(activityId);
        }
      }
    } catch (error) {
      console.error("Error adding quiz answer:", error);
      handleError("Error al agregar la respuesta del quiz.");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleUpdateQuizAnswers = async (answerId, quizAnswerData, activityId) => {
    dispatch(showLoading());
    try {
      const response = await quizzesAnswersService.updateQuizAnswers(
        answerId,
        quizAnswerData
      );
      console.log("Updating quiz answer with data:", quizAnswerData);

      if (response) {
        console.log("Quiz answer updated successfully:", response);
        console.log("Activity ID:", activityId);
        if (activityId) {
          handleFetchQuizzes(activityId);
        }
      }
    } catch (error) {
      console.error("Error updating quiz answer:", error);
      handleError("Error al actualizar la respuesta del quiz.");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleDeleteQuizAnswers = async (answerId, activityId) => {
    dispatch(showLoading());
    try {
      const response = await quizzesAnswersService.deleteQuizAnswers(answerId);
      console.log("Deleting quiz answer with ID:", answerId);

      if (response) {
        console.log("Quiz answer deleted successfully:", response);
        console.log("Activity ID:", activityId);
        if (activityId) {
          handleFetchQuizzes(activityId);
        }
      }
    } catch (error) {
      console.error("Error deleting quiz answer:", error);
      handleError("Error al eliminar la respuesta del quiz.");
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseStructure();
    }
    // eslint-disable-next-line
  }, [courseId]);

  if (courseStructure == null) {
    // Still show a spinner on initial load, but don't block subsequent renders
    return <LoadingSpinner />;
  }

  return (
    <>
      {showSection == "CourseSectionActivity" && (
        <CourseSectionActivity
          onFetchQuizzes={handleFetchQuizzes}
          existingQuestions={existingQuestions}
          onGenerateEvaluation={handleGenerateEvaluation}
          onRegenerateEvaluation={handleRegenerateEvaluation}
          onAddQuizAnswers={handleAddQuizAnswers}
          onUpdateQuizAnswers={handleUpdateQuizAnswers}
          onDeleteQuizAnswers={handleDeleteQuizAnswers}
          generatedQuestions={generatedQuestions}
          handleError={handleError}
          courseId={courseId}
          courseStructure={courseStructure}
          handleRegenerate={handleRegenerate}
          handleUpdateActivityTitle={handleUpdateActivityTitle}
          handleDeleteActivity={handleDeleteActivity}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          onEvaluationStatusChange={onEvaluationStatusChange}
          triggerEvaluationView={triggerEvaluationView}
        />
      )}
      {showSection == "CourseEdition" && (
        <CourseEdition
          handleError={handleError}
          courseId={courseId}
          courseStructure={courseStructure}
          handleRegenerate={handleRegenerate}
          handleUpdateActivityTitle={handleUpdateActivityTitle}
          handleDeleteActivity={handleDeleteActivity}
        />
      )}
    </>
  );
};

export default CourseEditPage;
