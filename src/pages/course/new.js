import CourseLayout from "../../shared/layouts/CourseLayout";
import CourseFormPage from "../../modules/Course/containers/CourseFormPage";
import { useState } from 'react';
import ErrorMessage from '../../shared/layouts/components/ErrorMessage'; // Importing ErrorMessage

const NewCoursePage = () => {
    const [error, setError] = useState(null); // State to hold error messages

    // Example error handling logic
    const handleError = (errorMessage) => {
        setError(errorMessage);
    };

    return (
        <CourseLayout currentPage="NewCoursePage">
            {error && <ErrorMessage error={error} />} {/* Display error message if exists */}
            <CourseFormPage handleError={handleError} />
        </CourseLayout>
    );
};

export default NewCoursePage;
