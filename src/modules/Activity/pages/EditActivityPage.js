import React from "react";
import ActivityEditor from "../components/ActivityEditor"; // Adjust the import path as necessary
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setActualComponent } from "../../../shared/store/rootActions";

const EditActivityPage = ({ courseId, handleError }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Cerrar modal de generación de video y actualizar el estado global
  const handleCloseModal = () => {
    dispatch(setActualComponent("CourseSectionActivity"));
    router.push(`/`); // Redirige al listado de recursos (index)
  };

  return (
    <ActivityEditor
      courseId={courseId}
      handleError={handleError}
      onClose={handleCloseModal}
    />
  );
};

export default EditActivityPage;
