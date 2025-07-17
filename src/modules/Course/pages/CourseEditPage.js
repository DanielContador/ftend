import React, { useState, useEffect } from "react";
import CourseEdition from "../components/CourseEdition/CourseEdition";
import CourseSectionActivity from "../components/CourseEdition/CourseSectionActivity";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import courseService from "../services/courseService";
import courseContentAIService from "../services/courseContentAIService";
import { useCrudManager } from "../../../shared/hooks/useCrudManager";
import {
  updateActivityTitle,
  deleteActivity,
} from "../services/courseStructureService";
import { useDispatch } from "react-redux";
import { setEditType } from "../../../shared/store/rootActions";

const CourseEditPage = ({ handleError, showSection, onContinue, selectedTab, setSelectedTab }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { courseId } = router.query;
  const [courseStructure, setCourseStructure] = useState(null);
  const [loading, setLoading] = useState(true);

  const crud = useCrudManager(courseService, handleError, t, {
    fetchOnMount: false,
  });
  const dispatch = useDispatch();

  const handleRegenerate = async (instructions, courseId) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const fetchCourseStructure = async () => {
    if (courseId) {
      setLoading(true);
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
        setLoading(false);
      }
    }
  };

  const handleDeleteActivity = async (activityId) => {
    setLoading(true);
    try {
      await deleteActivity("activity", activityId);
      fetchCourseStructure();
    } catch (error) {
      console.error("Error deleting activity:", error);
      handleError(t("deleteActivityError"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateActivityTitle = async (text, activityId) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseStructure();
    }
    // eslint-disable-next-line
  }, [courseId]);

  if (loading || courseStructure == null) return <LoadingSpinner />;

  return (
    <>
      {showSection == "CourseSectionActivity" && (
        <CourseSectionActivity
          handleError={handleError}
          courseId={courseId}
          courseStructure={courseStructure}
          handleRegenerate={handleRegenerate}
          handleUpdateActivityTitle={handleUpdateActivityTitle}
          handleDeleteActivity={handleDeleteActivity}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
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
