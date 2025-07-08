import React, { useEffect, useState } from "react";
import courseService from "../services/courseService";
import resourceService from "../services/resourceService"; // Importing the service
import { useCrudManager } from "../../../shared/hooks/useCrudManager";
import { useResourceManager } from "../hooks/useResourceManager";
// import CourseList from "../components/CourseList"; // Importing the new CourseList component
import LoadingSpinner from "../../../shared/components/LoadingSpinner"; // Importing the loading spinner
import styles from "./CourseListFormPage.module.css"; // Assuming we will create a CSS file for styles
import { useRouter } from "next/router"; // Importing useRouter for navigation
import { useTranslation } from "react-i18next"; // Importing useTranslation
import CourseListForm from "../components/CourseList/CourseListForm";
import { useDispatch } from "react-redux";
import { setActualComponent } from "../../../shared/store/rootActions";

const CourseListPage = ({ handleError }) => {
  const { t } = useTranslation();
  const crud = useCrudManager(courseService, handleError, t, {
    fetchOnMount: false,
  });
  const crudResources = useCrudManager(resourceService, handleError, t, {
    fetchOnMount: true,
  });
  const filteredResources = useResourceManager(resourceService, handleError, t);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    await crud.deleteItem(id);
    await crudResources.reload();
  };

  const handleEdit = (id, type) => {
    dispatch(setActualComponent("CourseEdition"));
    // Logic for editing a course
    console.log(`Edit course with id: ${id}`);
    router.push(`/course/${id}/edit?${type}`);
  };

  const handleCreate = () => {
    console.log("Create new course");
    router.push("/course/new"); // Redirect to the new course page using Next.js router
  };

  return (
    <>
      {crudResources.loading && (
        <div className={styles.loadingCoursesArea}>
          <LoadingSpinner />
        </div>
      )}
      {!crudResources.loading && (
        <CourseListForm
          data={crudResources?.items?.resources}
          handleCreate={handleCreate}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleFilterData={filteredResources.getFilteredResources}
        />
      )}
    </>
  );
};

export default CourseListPage;
