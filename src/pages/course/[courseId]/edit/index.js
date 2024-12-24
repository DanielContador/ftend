import CourseLayout from '../../../../layouts/CourseLayout';
import { useRouter } from 'next/router';
import ErrorMessage from '../../../../layouts/components/ErrorMessage';
import { useState, useEffect } from 'react';
import { getCourseById } from '../../../../modules/Course/services/courseService'; // Import the service to get course details
import LoadingSpinner from '../../../../modules/Shared/components/LoadingSpinner'; // Import a loading spinner component

const EditCoursePage = () => {
    const router = useRouter();
    const { courseId } = router.query;
    const [error, setError] = useState(null);
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await getCourseById('course', courseId);
                setCourseData(response);
            } catch (error) {
                setError('Error fetching course details');
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourseDetails();
        }
    }, [courseId]);

    const handleError = (errorMessage) => {
        setError(errorMessage);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <CourseLayout courseId={courseId} currentPage="EditCoursePage">
            {error && <ErrorMessage error={error} />}
            {courseData ? (
                <div>
                    <h1>{courseData.name}</h1>
                    <p>{courseData.description}</p>
                    <p><strong>Tema:</strong> {courseData.topic}</p>
                    <p><strong>Duración:</strong> {courseData.duration} minutos</p>
                    <p><strong>Fecha Creación:</strong> {new Date(courseData.timeCreated).toLocaleString()}</p>
                    {/* Add more course details as needed */}
                </div>
            ) : (
                <p>No course data available</p>
            )}
        </CourseLayout>
    );
};

export default EditCoursePage;
