import React from "react";
import CourseStructureNavigation from "../components/CourseStructureNavigation"; // Adjust the import path as necessary
import ActivityEditor from "../components/ActivityEditor"; // Adjust the import path as necessary
import styles from "./EditActivityPage.module.css"; // Importing styles
import { useRouter } from "next/router";

const EditActivityPage = ({ courseId, id, format, handleError }) => {
  const router = useRouter();
  // Cerrar modal de generación de video
  const handleCloseVideoModal = () => {
    router.push(`/course/${courseId}/edit`);
  };

  // return (
  //     <div className={styles.editActivityPage}>
  //         <aside className={styles.navigation}>
  //             <CourseStructureNavigation courseId={courseId} handleError={handleError} />
  //         </aside>
  //         <div className={styles.editor}>
  //             <ActivityEditor courseId={courseId} handleError={handleError} />
  //         </div>
  //     </div>
  // );
  return (
    <ActivityEditor
      courseId={courseId}
      handleError={handleError}
      onClose={handleCloseVideoModal}
    />
  ); // Render ActivityGenerationVideo component instead of the editor
};

export default EditActivityPage;
