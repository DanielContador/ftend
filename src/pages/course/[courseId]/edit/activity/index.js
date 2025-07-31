import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showFloatingError } from "../../../../../shared/store/rootActions";
import EditActivityPage from "../../../../../modules/Activity/pages/EditActivityPage"; // Importing EditActivityPage
import ManagementLayout from "../../../../../shared/layouts/managementlayout/ManagementLayout";
import SaveContinueButton from "../../../../../shared/layouts/components/management/SaveContinueButton"; // Importing SaveContinueButton

const ActivityEditorPage = () => {
  const router = useRouter();
  const { courseId } = router.query;
  const { id, format } = router.query; // Destructure id and type from query parameters
  const dispatch = useDispatch();

  console.log("type", format);
  console.log("id", id);
  
  const handleError = (errorMessage) => {
    dispatch(showFloatingError(errorMessage));
  };

  return (
    <ManagementLayout
      button={<SaveContinueButton text="Siguiente" displayIcon={false} />}
    >
      <EditActivityPage
        courseId={courseId}
        id={id}
        format={format}
        handleError={handleError}
      />{" "}
      {/* Render EditActivityPage */}
    </ManagementLayout>
  );
};

export default ActivityEditorPage;
