import React from 'react';
import CourseStructureNavigation from '../components/CourseStructureNavigation'; // Adjust the import path as necessary
import ActivityEditor from '../components/ActivityEditor'; // Adjust the import path as necessary
import styles from './EditActivityPage.module.css'; // Importing styles

const EditActivityPage = ({ courseId, id, format, handleError }) => {
    return (
        <div className={styles.editActivityPage}>
            <aside className={styles.navigation}>
                <CourseStructureNavigation courseId={courseId} handleError={handleError} />
            </aside>
            <div className={styles.editor}>
                <ActivityEditor courseId={courseId} handleError={handleError} />
            </div>
        </div>
    );
};

export default EditActivityPage;
