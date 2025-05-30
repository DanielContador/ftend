import React, { useEffect, useState } from 'react';
import courseContentAIService from '../../Course/services/courseContentAIService';
import LoadingSpinner from '../../../shared/components/LoadingSpinner'; // Importing LoadingSpinner
import { useRouter } from 'next/router'; // Import useRouter
import styles from './CourseStructureNavigation.module.css'; // Assuming a CSS file for styles
import Button2 from '../../../shared/components/Button2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears } from '@fortawesome/free-solid-svg-icons';

const CourseStructureNavigation = ({ courseId, handleError }) => {
    const [structure, setStructure] = useState({});
    const [loading, setLoading] = useState(true); // Loading state
    const [expandedModules, setExpandedModules] = useState([]); // State to manage expanded modules
    const router = useRouter(); // Initialize useRouter

    const fetchCourseStructure = async () => {
        if (courseId) {
            setLoading(true); // Set loading to true before fetching
            try {
                const data = await courseContentAIService.getCourseStructure(courseId,'/course-structure'); // Replace with actual endpoint
                setStructure(data.courseStructure);
                // Set all modules to expanded by default
                setExpandedModules(data.courseStructure.modules.map((_, index) => index));
            } catch (error) {
                console.error('Error fetching course structure:', error);
                handleError('Error fetching course structure'); // Handle error
            } finally {
                setLoading(false); // Set loading to false after fetching or error
            }
        }
    };

    useEffect(() => {
        fetchCourseStructure();
    }, [courseId]);

    if (loading) {
        return <LoadingSpinner />; // Render loading spinner while loading
    }

    const handleGoToActivity = (moduleIndex, activityIndex) => {
        const activityId = structure.modules[moduleIndex].learning_objects[activityIndex].id; // Assuming each activity has an id
        const activityFormat = structure.modules[moduleIndex].learning_objects[activityIndex].format;
        router.push(`/course/${courseId}/edit/activity/?id=${activityId}&format=${activityFormat}`); // Redirect to the activity edit page
    };

    const toggleModule = (index) => {
        setExpandedModules(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        ); // Toggle module expansion
    };

    return (
        <div className={styles.modules}>
            {structure.modules.map((module, index) => (
                <div key={index} className={styles.module}>
                    <div className={styles.moduleHeader} onClick={() => toggleModule(index)}>
                        <div className={styles.moduleTitle}>
                            {module.module_title}
                        </div>
                    </div>
                    {expandedModules.includes(index) && (
                        <div className={styles.activities}>
                            {module.learning_objects.map((activity, objIndex) => (
                                <div key={objIndex} className={styles.activity}>
                                    <p>{activity.object_title}</p>
                                    <Button2 onClick={() => handleGoToActivity(index, objIndex)}>
                                        <FontAwesomeIcon icon={faGears} className={styles.icon} />
                                    </Button2>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CourseStructureNavigation;
