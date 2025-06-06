import CourseLayout from "../../../../shared/layouts/CourseLayout";
import { useRouter } from "next/router";
import ErrorMessage from "../../../../shared/layouts/components/ErrorMessage";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../../../shared/components/LoadingSpinner"; // Import a loading spinner component
import courseService from "../../../../modules/Course/services/courseService";
import { useCrudManager } from "../../../../shared/hooks/useCrudManager";

const EditCoursePage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { courseId } = router.query;
  const [error, setError] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const crud = useCrudManager(courseService, handleError, t, {
    fetchOnMount: false,
  });

  useEffect(() => {
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

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  if (loading) return <LoadingSpinner />;

  return (
    <CourseLayout courseId={courseId} currentPage="EditCoursePage">
      {error && <ErrorMessage error={error} />}
      {courseData ? (
        <div>
          <h1>{courseData.name}</h1>
          <p>{courseData.description}</p>
          <p>
            <strong>Tema:</strong> {courseData.topic}
          </p>
          <p>
            <strong>Duración:</strong> {courseData.duration} minutos
          </p>
          <p>
            <strong>Fecha Creación:</strong>{" "}
            {new Date(courseData.timeCreated).toLocaleString()}
          </p>
          {/* Add more course details as needed */}
        </div>
      ) : (
        <p>No course data available</p>
      )}
    </CourseLayout>
  );
};

export default EditCoursePage;
