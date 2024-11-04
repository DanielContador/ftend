import React from 'react';
import CourseForm from '../components/CourseForm'; // Importing the CourseForm component
import styles from './CourseFormPage.module.css'; // Assuming we will create a CSS file for styles
import { generateCourseStructure } from '../services/courseService'; // Importing the service
import { useRouter } from 'next/router'; // Importing useRouter for navigation

const CourseFormPage = ( {handleError}) => {
    const router = useRouter();

    const handleFormSubmit = async (formData) => {
        console.log('Form data:', formData);
        try {
            const response = await generateCourseStructure('CourseContentAI/generate-course-structure', formData);
            const generatedCourseId = response.courseId; // Assuming the response contains the courseId
            // const courseStructure = response.courseStructure; // Assuming the response contains the courseStructure
            // Redirect to the new course structure page with generatedCourseId and courseStructure
            router.push(`/course/${generatedCourseId}/edit/course-structure`);
        } catch (error) {
            console.error('Error generating course structure:', error);
            handleError('Failed to generate course structure. Please try again later.'); // Handle error
        }
    };

    return (
        <div className={styles.container}>
            <CourseForm onSubmit={handleFormSubmit} /> {/* Using the CourseForm component */}
        </div>
    );
};

export default CourseFormPage;
