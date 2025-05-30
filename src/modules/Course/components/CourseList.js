import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheckCircle, faTimesSquare } from '@fortawesome/free-solid-svg-icons';
import Button2 from '../../../shared/components/Button2'; // Importing Button2 for actions
import styles from './CourseList.module.css'; // Using CSS modules for styles
import DeleteConfirmationPopup from '../../../shared/components/DeleteConfirmationPopup'; // Updated import path
import { useTranslation } from 'react-i18next'; // Importing useTranslation

const CourseList = ({ courses, onEdit, onDelete }) => {
    const { t } = useTranslation(); // Using the translation hook
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    const handleDeleteClick = (courseId) => {
        setCourseToDelete(courseId);
        setIsPopupOpen(true);
    };

    const handleConfirmDelete = () => {
        onDelete(courseToDelete);
        setIsPopupOpen(false);
        setCourseToDelete(null);
    };

    const handleCancelDelete = () => {
        setIsPopupOpen(false);
        setCourseToDelete(null);
    };

    return (
        <>
            <ul className={styles.courseList}>
                {courses.map(course => {
                    const duration = course.duration >= 60 
                        ? `${Math.floor(course.duration / 60)}:${String(course.duration % 60).padStart(2, '0')}` // Format as HH:MM
                        : `00:${String(course.duration).padStart(2, '0')}`; // Format as MM:00
                    return (
                        <li key={course.id} className={styles.courseItem}>
                            <div className={styles.courseInfo}>
                                <span className={styles.courseName}>{course.name}</span>
                                <div className={styles.courseStatus}>
                                    {course.status === t('draft') && (
                                        <FontAwesomeIcon icon={faCheckCircle} className={`${styles.statusIcon} ${styles.draft}`} />
                                    )}
                                    {course.status !== t('draft') && (
                                        <FontAwesomeIcon icon={faTimesSquare} className={`${styles.statusIcon} ${styles.completed}`} />
                                    )}
                                    <span>{course.status}</span>
                                </div>
                            </div>
                            <span className={styles.courseDuration}>{duration}</span>
                            <div className={styles.courseActions}>
                                <Button2 onClick={() => onEdit(course.id)} className={styles.editButton}>
                                    <FontAwesomeIcon icon={faEdit} /> {t('edit')}
                                </Button2>
                                <Button2 onClick={() => handleDeleteClick(course.id)} className={styles.deleteButton}>
                                    <FontAwesomeIcon icon={faTrash} /> {t('delete')}
                                </Button2>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <DeleteConfirmationPopup 
                isOpen={isPopupOpen} 
                onClose={handleCancelDelete} 
                onConfirm={handleConfirmDelete} 
                title={t('confirmDeletion')} 
                message={t('confirmDeletionMessage')} 
            />
        </>
    );
};

export default CourseList;
