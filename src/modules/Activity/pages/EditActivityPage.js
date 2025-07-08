import React from "react";
import ActivityEditor from "../components/ActivityEditor"; // Adjust the import path as necessary
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setActualComponent } from "../../../shared/store/rootActions";

const EditActivityPage = ({ courseId, handleError }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const editType = useSelector((state) => state.editType?.editType);

  // Cerrar modal de generación de video y actualizar el estado global
  const handleCloseModal = () => {
    if (editType === "material") {
      router.push(`/`);
    } else if (editType === "course") {
      dispatch(setActualComponent("CourseSectionActivity"));
      router.push(`/course/${courseId}/edit`);
    } else {
      router.push(`/`);
    }
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
