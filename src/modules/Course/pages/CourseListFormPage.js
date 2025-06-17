import React, { useEffect, useState } from "react";
import courseService from "../services/courseService"; // Importing the service
import { useCrudManager } from "../../../shared/hooks/useCrudManager";
import Button1 from "../../../shared/components/Button1";
// import CourseList from "../components/CourseList"; // Importing the new CourseList component
import LoadingSpinner from "../../../shared/components/LoadingSpinner"; // Importing the loading spinner
import styles from "./CourseListPage.module.css"; // Assuming we will create a CSS file for styles
import { useRouter } from "next/router"; // Importing useRouter for navigation
import { useTranslation } from "react-i18next"; // Importing useTranslation
import CourseListForm from "../components/CourseList/CourseListForm";

const CourseListPage = ({ handleError }) => {
  const { t } = useTranslation(); // Using the translation hook
  const crud = useCrudManager(courseService, handleError, t, {
    fetchOnMount: true,
  }); // Cambia aquí: agrega { fetchOnMount: true }
  const router = useRouter(); // Initialize router for navigation
  const handleDelete = async (id) => {
    crud.deleteItem(id);
  };

  const handleEdit = (id) => {
    // Logic for editing a course
    console.log(`Edit course with id: ${id}`);
    router.push(`/course/${id}/edit`);
  };

  const handleCreate = () => {
    console.log("Create new course");
    router.push("/course/new"); // Redirect to the new course page using Next.js router
  };

  return (
    <>
      {crud.loading && (
        <div className={styles.loadingCoursesArea}>
          <LoadingSpinner />
        </div>
      )}
      {!crud.loading && (
        <CourseListForm courses={crud.items} />
        // <div className={styles.courseListPage}>
        //   <div
        //     style={{
        //       display: "flex",
        //       justifyContent: "flex-end",
        //       marginBottom: "1em",
        //     }}
        //   >
        //     <Button1 onClick={handleCreate}>{t("newCourse")}</Button1>
        //   </div>
        //   <CourseList
        //     courses={crud.items}
        //     onEdit={handleEdit}
        //     onDelete={handleDelete}
        //   />
        // </div>
      )}
    </>
  );
};

export default CourseListPage;
