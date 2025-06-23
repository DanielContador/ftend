import ManagementLayout from "../../../../shared/layouts/managementlayout/ManagementLayout";
import ErrorMessage from "../../../../shared/layouts/components/ErrorMessage";
import CourseEditPage from "../../../../modules/Course/pages/CourseEditPage";
import SaveContinueButton from "../../../../shared/layouts/components/management/SaveContinueButton";
import { useState } from "react";

const EditCoursePage = () => {
  console.log("EditCoursePage");
  const [error, setError] = useState(null);

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <ManagementLayout
      button={<SaveContinueButton text={"Continuar"} displayIcon={false} />}
    >
      {error && <ErrorMessage error={error} />}
      {/* Display error message if exists */}
      <CourseEditPage handleError={handleError} />
    </ManagementLayout>
  );
};

export default EditCoursePage;
