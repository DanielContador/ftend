import React from "react";
import CourseEdition from "../components/CourseEdition/CourseEdition";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../../shared/components/LoadingSpinner"; // Import a loading spinner component
import courseService from "../services/courseService";
import courseContentAIService from "../services/courseContentAIService";
import { useCrudManager } from "../../../shared/hooks/useCrudManager";
import { updateActivityTitle } from "../services/courseStructureService";

const CourseEditPage = ({ handleError }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { courseId } = router.query;
  const [courseStructure, setCourseStructure] = useState(null);
  const [loading, setLoading] = useState(true);

  const crud = useCrudManager(courseService, handleError, t, {
    fetchOnMount: false,
  });

  const handleRegenerate = async (instructions, courseId) => {
    setLoading(true); // Set loading to true at the beginning
    try {
      const promptInstructionsData = {
        prompt: instructions,
        courseId: courseId,
      };
      await courseContentAIService.reGenerateCourseStructure(
        promptInstructionsData,
        "/regenerate-course-structure"
      ); // Replace with actual endpoint
      console.log("Regeneration successful");
      fetchCourseStructure(); // Call fetchCourseStructure instead of setting structure directly
    } catch (error) {
      console.error("Error regenerating course structure:", error);
      handleError(t("regenerateCourseStructureError")); // Handle error with translation
    } finally {
      setLoading(false); // Set loading to false at the end
    }
  };

  const fetchCourseStructure = async () => {
    if (courseId) {
      setLoading(true);
      try {
        const data = await courseContentAIService.getCourseStructure(
          courseId,
          "/course-structure"
        ); // Replace with actual endpoint
        setCourseStructure(data.courseStructure);
      } catch (error) {
        console.error("Error fetching course structure:", error);
        handleError(t("fetchCourseStructureError")); // Handle error with translation
      } finally {
        setLoading(false); // Set loading to false after fetching or error
      }
    }
  };

  const handleUpdateActivityTitle = async (text, activityId) => {
    setLoading(true);
    try {
      const activityData = {
        name: text,
      };
      await updateActivityTitle("activity", activityId, activityData); // Call the updateModuleTitle function with the endpoint, activityId, and new title
      fetchCourseStructure();
    } catch (error) {
      console.error("Error updating activity title:", error);
      handleError(t("updateActivityTitleError")); // Handle error with translation
    } finally {
      setLoading(false); // Set loading to false at the end
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseStructure();
    }
  }, [courseId]);

  if (loading || courseStructure == null) return <LoadingSpinner />;

  return (
    <CourseEdition
      handleError={handleError}
      courseId={courseId}
      courseStructure={courseStructure}
      handleRegenerate={handleRegenerate}
      handleUpdateActivityTitle={handleUpdateActivityTitle}
    />
  );
};

export default CourseEditPage;
