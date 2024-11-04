import CourseLayout from '../../../../layouts/CourseLayout'; // Importing CourseLayout
import EditCourseStructure from '../../../../modules/Course/containers/EditCourseStructure'; // Importing EditCourseStructure
import { useRouter } from 'next/router';
import ErrorMessage from '../../../../layouts/components/ErrorMessage'; // Importing ErrorMessage
import { useState } from 'react';

const CourseStructurePage = () => {
    const router = useRouter();
    const { courseId } = router.query;
    const [error, setError] = useState(null); // State to hold error messages

    // Example error handling logic
    const handleError = (errorMessage) => {
        setError(errorMessage);
    };

    return (
        <CourseLayout courseId={courseId} currentPage="CourseStructurePage">
            {error && <ErrorMessage error={error} />} {/* Display error message if exists */}
            <EditCourseStructure courseId={courseId} handleError={handleError}/>
        </CourseLayout>
    );
};

export default CourseStructurePage;
