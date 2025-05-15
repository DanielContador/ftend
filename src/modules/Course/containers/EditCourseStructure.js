import React, { useEffect, useState } from 'react';
import courseService from '../services/courseService'; // Adjust the import path as necessary
import courseContentAIService from '../services/courseContentAIService';
import styles from './EditCourseStructure.module.css';
import LoadingSpinner from '../../Shared/components/LoadingSpinner'; // Importing LoadingSpinner
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faEdit, faTrash, faGears } from '@fortawesome/free-solid-svg-icons'; // Importing icons for arrow buttons, edit, delete, and gears
import { useTranslation } from 'react-i18next'; // Importing useTranslation
import Button2 from '../../Shared/components/Button2'; // Updated to use Button2
import { deleteTopic, deleteActivity, updateModuleTitle, updateActivityTitle } from '../services/courseStructureService'; // Import deleteTopic function
import { useRouter } from 'next/router'; // Import useRouter
import { useCrudManager } from '../../Shared/containers/useCrudManager';

const EditCourseStructure = ({ courseId, handleError }) => {
    const { t } = useTranslation(); // Using the translation hook
    const [structure, setStructure] = useState({});
    const [loading, setLoading] = useState(true); // Loading state
    const [expandedModules, setExpandedModules] = useState([]); // State to manage expanded modules
    const [instructions, setInstructions] = useState(''); // State for instructions
    const [courseTitle, setCourseTitle] = useState(''); // State for course title
    const [isEditingCourseTitle, setIsEditingCourseTitle] = useState(false); // State to manage title editing
    const [isEditingModuleTitle, setIsEditingModuleTitle] = useState({}); // State to manage module title editing
    const [isEditingActivityTitle, setIsEditingActivityTitle] = useState({}); // State to manage activity title editing
    const router = useRouter(); // Initialize useRouter
    const crud = useCrudManager(courseService, handleError, t);

    const fetchCourseStructure = async () => {
        if (courseId) {
            setLoading(true); // Set loading to true before fetching
            try {
                const data = await courseContentAIService.getCourseStructure(courseId,'/course-structure'); // Replace with actual endpoint
                console.log('Course structure:', data);
                setStructure(data.courseStructure);
                setCourseTitle(data.courseStructure.course_title); // Set initial course title
                // Set all modules to expanded by default
                setExpandedModules(data.courseStructure.modules.map((_, index) => index));
            } catch (error) {
                console.error('Error fetching course structure:', error);
                handleError(t('fetchCourseStructureError')); // Handle error with translation
            } finally {
                setLoading(false); // Set loading to false after fetching or error
            }
        }
    };

    useEffect(() => {
        fetchCourseStructure();
    }, [courseId]);

    const handleRegenerate = async () => {
        setLoading(true); // Set loading to true at the beginning
        try {
            const promptInstructionsData = {
                prompt: instructions,
                courseId: courseId
            };
            await courseContentAIService.reGenerateCourseStructure(promptInstructionsData,'/regenerate-course-structure'); // Replace with actual endpoint
            console.log('Regeneration successful');
            fetchCourseStructure(); // Call fetchCourseStructure instead of setting structure directly
        } catch (error) {
            console.error('Error regenerating course structure:', error);
            handleError(t('regenerateCourseStructureError')); // Handle error with translation
        } finally {
            setLoading(false); // Set loading to false at the end
        }
    };

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            try {
                const courseData = {
                    Name: event.target.value,
                };
                crud.editItem(courseId, courseData); // Call the updateCourseTitle function with the endpoint, courseId, and new title
                setCourseTitle(event.target.value); // Update course title
                setIsEditingCourseTitle(false); // Stop editing on save
                console.log('Course title updated to:', event.target.value);
            } catch (error) {
                console.error('Error updating course title:', error);
                handleError(t('updateCourseTitleError')); // Handle error with translation
            }
        }
    };

    const handleModuleTitleChange = (index, newTitle) => {
        setIsEditingModuleTitle(prev => ({ ...prev, [index]: false })); // Stop editing on save
        setStructure(prevStructure => {
            const updatedModules = [...prevStructure.modules];
            updatedModules[index].module_title = newTitle;
            return { ...prevStructure, modules: updatedModules };
        });
        console.log(`Module title updated to: ${newTitle} at index: ${index}`);
    };

    const handleModuleKeyPress = async (event, index) => {
        if (event.key === 'Enter') {
            try {
                const moduleId = structure.modules[index].id; // Assuming each module has an id
                const moduleData = {
                    Title: event.target.value,
                };
                await updateModuleTitle('topic', moduleId, moduleData); // Call the updateModuleTitle function with the endpoint, moduleId, and new title
                handleModuleTitleChange(index, event.target.value); // Update module title
            } catch (error) {
                console.error('Error updating module title:', error);
                handleError(t('updateModuleTitleError')); // Handle error with translation
            }
        }
    };

    const handleActivityTitleChange = (moduleIndex, activityIndex, newTitle) => {
        setIsEditingActivityTitle(prev => ({ ...prev, [`${moduleIndex}-${activityIndex}`]: false })); // Stop editing on save
        setStructure(prevStructure => {
            const updatedModules = [...prevStructure.modules];
            updatedModules[moduleIndex].learning_objects[activityIndex].object_title = newTitle;
            return { ...prevStructure, modules: updatedModules };
        });
        console.log(`Activity title updated to: ${newTitle} at module: ${moduleIndex}, activity: ${activityIndex}`);
    };

    const handleActivityKeyPress = async (event, moduleIndex, activityIndex) => {
        if (event.key === 'Enter') {
            try {
                const activityId = structure.modules[moduleIndex].learning_objects[activityIndex].id; // Assuming each activity has an id
                const activityData = {
                    Name: event.target.value,
                };
                await updateActivityTitle('activity', activityId, activityData); // Call the updateModuleTitle function with the endpoint, activityId, and new title
                handleActivityTitleChange(moduleIndex, activityIndex, event.target.value); // Update activity title
            } catch (error) {
                console.error('Error updating activity title:', error);
                handleError(t('updateActivityTitleError')); // Handle error with translation
            }
        }
    };

    const handleDeleteTopic = async (index) => {
        try {
            const topicId = structure.modules[index].id; // Assuming each module has an id
            await deleteTopic('topic', topicId); // Call the deleteTopic function with the endpoint and topic id
            console.log('Topic deleted at index:', index);
            fetchCourseStructure(); // Refresh the course structure after deletion
        } catch (error) {
            console.error('Error deleting topic:', error);
            handleError(t('deleteTopicError')); // Handle error with translation
        }
    };

    const handleDeleteActivity = async (moduleIndex, activityIndex) => {
        try {
            const activityId = structure.modules[moduleIndex].learning_objects[activityIndex].id; // Assuming each activity has an id
            await deleteActivity('activity', activityId); // Call the deleteActivity function with the endpoint and activity id
            console.log('Activity deleted at module:', moduleIndex, 'activity:', activityIndex);
            fetchCourseStructure(); // Refresh the course structure after deletion
        } catch (error) {
            console.error('Error deleting activity:', error);
            handleError(t('deleteActivityError')); // Handle error with translation
        }
    };

    const handleGoToActivity = (moduleIndex, activityIndex) => {
        const activityId = structure.modules[moduleIndex].learning_objects[activityIndex].id; // Assuming each activity has an id
        const activityFormat = structure.modules[moduleIndex].learning_objects[activityIndex].format; // Assuming each activity has an id
        router.push(`/course/${courseId}/edit/activity/?id=${activityId}&format=${activityFormat}`); // Redirect to the activity edit page
    };

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
            <div className={styles.instructionsContainer}>
                <h2>{t('globalActionsWithStructure')}</h2>
                <label>{t('regenerateInstructions')}:</label>
                <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder={t('enterInstructions')}
                    className={styles.instructionsTextarea}
                />
                <Button2 onClick={handleRegenerate} className={styles.regenerateButton}>
                    {t('regenerateEntireStructure')}
                </Button2>
            </div>
            <div className={styles.courseHeader}>
                {isEditingCourseTitle ? (
                    <input 
                        type="text" 
                        defaultValue={courseTitle} // Use defaultValue instead of value
                        onKeyPress={handleKeyPress} // Add onKeyPress handler
                        className={`${styles.courseTitleInput} ${styles.editing}`} 
                    />
                ) : (
                    <span className={styles.courseTitleText}>{courseTitle}</span>
                )}
                <Button2 onClick={() => setIsEditingCourseTitle(!isEditingCourseTitle)} className={styles.editButton}>
                    <FontAwesomeIcon icon={faEdit} className={styles.icon} />
                </Button2>
            </div>
            <p><strong>{t('estimatedTimeLabel')}</strong> {structure.estimated_time} {t('minutes')}</p>
            <div className={styles.modules}>
                {structure.modules.map((module, index) => (
                    <div key={index} className={styles.module}>
                        <div className={styles.moduleHeader}>
                            <div className={styles.moduleTitle} onClick={() => toggleModule(index)}>
                                <FontAwesomeIcon icon={expandedModules.includes(index) ? faChevronDown : faChevronRight} />
                                {isEditingModuleTitle[index] ? (
                                    <input 
                                        type="text" 
                                        defaultValue={module.module_title} // Use defaultValue instead of value
                                        onKeyPress={(e) => handleModuleKeyPress(e, index)} // Add onKeyPress handler
                                        className={`${styles.moduleTitleInput} ${styles.editing}`} 
                                    />
                                ) : (
                                    <span className={styles.moduleTitleText}>{module.module_title}</span>
                                )}
                            </div>
                            <div className={styles.moduleActions}>
                                <span className={styles.moduleDuration}>{module.estimated_time} {t('minutes')}</span>
                                <Button2 onClick={() => setIsEditingModuleTitle(prev => ({ ...prev, [index]: !isEditingModuleTitle[index] }))} className={styles.editButton}>
                                    <FontAwesomeIcon icon={faEdit} className={styles.icon} />
                                </Button2>
                                <Button2 onClick={() => handleDeleteTopic(index)}>
                                    <FontAwesomeIcon icon={faTrash} className={styles.icon} />
                                </Button2>
                            </div>
                        </div>
                        {expandedModules.includes(index) && (
                            <div className={styles.activities}>
                                {module.learning_objects.map((learningObject, objIndex) => (
                                    <div key={objIndex} className={styles.activity}>
                                        <div>
                                            {isEditingActivityTitle[`${index}-${objIndex}`] ? (
                                                <input 
                                                    type="text" 
                                                    defaultValue={learningObject.object_title} // Use defaultValue instead of value
                                                    onKeyPress={(e) => handleActivityKeyPress(e, index, objIndex)} // Add onKeyPress handler
                                                    className={`${styles.activityTitleInput} ${styles.editing}`} 
                                                />
                                            ) : (
                                                <p><strong>{t('title')}</strong> {learningObject.object_title}</p>
                                            )}
                                            <p><strong>{t('duration')}</strong> {learningObject.estimated_time} {t('minutes')}</p>
                                            <p><strong>{t('format')}</strong> {learningObject.format}</p>
                                        </div>
                                        <div className={styles.activityActions}>
                                            <Button2 onClick={() => handleGoToActivity(index, objIndex)}>
                                                <FontAwesomeIcon icon={faGears} className={styles.icon} />
                                            </Button2>
                                            <Button2 onClick={() => setIsEditingActivityTitle(prev => ({ ...prev, [`${index}-${objIndex}`]: !isEditingActivityTitle[`${index}-${objIndex}`] }))}>
                                                <FontAwesomeIcon icon={faEdit} className={styles.icon} />
                                            </Button2>
                                            <Button2 onClick={() => handleDeleteActivity(index, objIndex)}>
                                                <FontAwesomeIcon icon={faTrash} className={styles.icon} />
                                            </Button2>
                                        </div>
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
