import React, { useEffect, useState } from 'react';
import { getCourseStructure } from '../services/courseService'; // Adjust the import path as necessary
import styles from './EditCourseStructure.module.css';
import LoadingSpinner from '../../Shared/components/LoadingSpinner'; // Importing LoadingSpinner
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'; // Importing icons for arrow buttons

const EditCourseStructure = ({ courseId, handleError }) => {
    const [structure, setStructure] = useState({});
    const [loading, setLoading] = useState(true); // Loading state
    const [expandedModules, setExpandedModules] = useState([]); // State to manage expanded modules

    useEffect(() => {
        const fetchCourseStructure = async () => {
            if (courseId) {
                setLoading(true); // Set loading to true before fetching
                try {
                    const data = await getCourseStructure('CourseContentAI/course-structure', courseId); // Replace with actual endpoint
                    console.log('Course structure:', data);
                    setStructure(data.courseStructure);
                    // Set all modules to expanded by default
                    setExpandedModules(data.courseStructure.modules.map((_, index) => index));
                } catch (error) {
                    console.error('Error fetching course structure:', error);
                    handleError('Failed to fetch course structure. Please try again later.'); // Handle error
                } finally {
                    setLoading(false); // Set loading to false after fetching or error
                }
            }
        };
        fetchCourseStructure();
    }, [courseId]);

    if (loading) {
        return <LoadingSpinner />; // Render loading spinner while loading
    }

    const toggleModule = (index) => {
        setExpandedModules(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        ); // Toggle module expansion
    };

    return (
        <div className={styles.container}>
            <h1>{structure.course_title}</h1>
            <p><strong>Tiempo Estimado:</strong> {structure.estimated_time} minutos</p>
            <div className={styles.modules}>
                {structure.modules.map((module, index) => (
                    <div key={index} className={styles.module}>
                        <div onClick={() => toggleModule(index)} className={styles.moduleHeader}>
                            <div className={styles.moduleTitle}>
                                <FontAwesomeIcon icon={expandedModules.includes(index) ? faChevronDown : faChevronRight} />
                                <h4>{module.module_title}</h4>
                            </div>
                            <span className={styles.moduleDuration}>{module.estimated_time} minutos</span>
                        </div>
                        {expandedModules.includes(index) && (
                            <div className={styles.activities}>
                                {module.learning_objects.map((learningObject, objIndex) => (
                                    <div key={objIndex} className={styles.activity}>
                                        <p><strong>Título:</strong> {learningObject.object_title}</p>
                                        <p><strong>Duración:</strong> {learningObject.estimated_time} minutos</p>
                                        <p><strong>Formato:</strong> {learningObject.format}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditCourseStructure;
