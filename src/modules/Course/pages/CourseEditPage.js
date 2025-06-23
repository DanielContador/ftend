import React, { useState, useEffect } from "react";
import CourseEdition from "../components/CourseEdition/CourseEdition";
import CourseSectionActivity from "../components/CourseEdition/CourseSectionActivity";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import courseService from "../services/courseService";
import courseContentAIService from "../services/courseContentAIService";
import { useCrudManager } from "../../../shared/hooks/useCrudManager";
import { updateActivityTitle } from "../services/courseStructureService";

const CourseEditPage = ({ handleError, showSection, onContinue }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { courseId } = router.query;
  const [courseStructure, setCourseStructure] = useState(null);
  const [loading, setLoading] = useState(true);

  const crud = useCrudManager(courseService, handleError, t, {
    fetchOnMount: false,
  });

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
        setCourseStructure(data.courseStructure);
      } catch (error) {
        console.error("Error fetching course structure:", error);
        handleError(t("fetchCourseStructureError"));
      } finally {
        setLoading(false);
      }
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
        />
      )}
      {showSection == "CourseEdition" && (
        <CourseEdition
          handleError={handleError}
          courseId={courseId}
          courseStructure={courseStructure}
          handleRegenerate={handleRegenerate}
          handleUpdateActivityTitle={handleUpdateActivityTitle}
        />
      )}
    </>
  );
};

export default CourseEditPage;
