import React from 'react';
import CourseForm from '../components/CourseForm'; // Importing the CourseForm component
import styles from './CourseFormPage.module.css'; // Assuming we will create a CSS file for styles
import courseService from '../services/courseService';
import { useRouter } from 'next/router'; // Importing useRouter for navigation
import { useTranslation } from 'react-i18next'; // Importing useTranslation

const CourseFormPage = ({ handleError }) => {
    const router = useRouter();
    const { t } = useTranslation(); // Using the translation hook

    const handleFormSubmit = async (formData) => {
        console.log('Form data:', formData);
        try {
            const response = await courseService.generateStructure(formData, '/CourseContentAI/generate-course-structure');
            console.log(response);
            const generatedCourseId = response.courseId; // Assuming the response contains the courseId
            // Redirect to the new course structure page with generatedCourseId
            router.push(`/course/${generatedCourseId}/edit/course-structure`);
        } catch (error) {
            console.error('Error generating course structure:', error);
            handleError(t('generateCourseStructureError')); // Using translation key for error message
        }
    };

    return (
        <div className={styles.container}>
            <CourseForm onSubmit={handleFormSubmit} /> {/* Using the CourseForm component */}
        </div>
    );
};

export default CourseFormPage;
