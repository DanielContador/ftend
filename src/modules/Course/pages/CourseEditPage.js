import React from "react";
import CourseEdition from "../components/CourseEdition/CourseEdition";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../../shared/components/LoadingSpinner"; // Import a loading spinner component
import courseService from "../services/courseService";
import courseContentAIService from "../services/courseContentAIService";
import { useCrudManager } from "../../../shared/hooks/useCrudManager";

const CourseEditPage = ({ handleError }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { courseId } = router.query;
  const [courseData, setCourseData] = useState(null);
  const [courseStructure, setCourseStructure] = useState(null);
  const [loading, setLoading] = useState(true);

  const crud = useCrudManager(courseService, handleError, t, {
    fetchOnMount: false,
  });

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

  const fetchCourseDetails = async () => {
    try {
      const response = await crud.getItemById(courseId);
      setCourseData(response);
    } catch (error) {
      setError("Error fetching course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      fetchCourseStructure();
    }
  }, [courseId]);

  if (loading && courseStructure == null) return <LoadingSpinner />;

  return (
    <CourseEdition
      handleError={handleError}
      courseId={courseId}
      courseData={courseData}
      courseStructure={courseStructure}
    />
  );
};

export default CourseEditPage;
