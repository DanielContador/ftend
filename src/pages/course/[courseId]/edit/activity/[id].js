import CourseLayout from '../../../../../shared/layouts/CourseLayout'; // Importing CourseLayout
import { useRouter } from 'next/router';
import ErrorMessage from '../../../../../shared/layouts/components/ErrorMessage'; // Importing ErrorMessage
import { useState } from 'react';
import EditActivityPage from '../../../../../modules/Activity/containers/EditActivityPage'; // Importing EditActivityPage

const ActivityEditorPage = () => {
    const router = useRouter();
    const { courseId } = router.query;
    const [error, setError] = useState(null); // State to hold error messages

    // Example error handling logic
    const handleError = (errorMessage) => {
        setError(errorMessage);
    };
    
    return (
        <CourseLayout courseId={courseId} currentPage="ActivityEditorPage">
            {error && <ErrorMessage error={error} />} {/* Display error message if exists */}
            <EditActivityPage courseId={courseId} handleError={handleError} /> {/* Render EditActivityPage */}
        </CourseLayout>
    );
};

export default ActivityEditorPage;
