import React from "react";
import ActivityEditor from "../components/ActivityEditor"; // Adjust the import path as necessary
import { useRouter } from "next/router";

const EditActivityPage = ({ courseId, handleError }) => {
  const router = useRouter();

  const handleCloseVideoModal = () => {
    router.push(`/course/${courseId}/edit`);
  };

  return (
    <ActivityEditor
      courseId={courseId}
      handleError={handleError}
      onClose={handleCloseVideoModal}
    />
  );
};

export default EditActivityPage;
