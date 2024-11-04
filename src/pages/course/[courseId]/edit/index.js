import CourseLayout from '../../../../layouts/CourseLayout'; // Importing CourseLayout
import { useRouter } from 'next/router';
import ErrorMessage from '../../../../layouts/components/ErrorMessage'; // Importing ErrorMessage
import { useState } from 'react';

const EditCoursePage = () => {
    const router = useRouter();
    const { courseId } = router.query;
    const [error, setError] = useState(null); // State to hold error messages

    // Example error handling logic
    const handleError = (errorMessage) => {
        setError(errorMessage);
    };

    return (
        <CourseLayout courseId={courseId} currentPage="EditCoursePage">
            {error && <ErrorMessage error={error} />} {/* Display error message if exists */}
            {/* Page content goes here */}
        </CourseLayout>
    );
};

export default EditCoursePage;
