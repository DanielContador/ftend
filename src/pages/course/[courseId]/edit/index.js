import ManagementLayout from "../../../../shared/layouts/managementlayout/ManagementLayout";
import ErrorMessage from "../../../../shared/layouts/components/ErrorMessage";
import CourseEditPage from "../../../../modules/Course/pages/CourseEditPage";
import SaveContinueButton from "../../../../shared/layouts/components/management/SaveContinueButton";
import { useState } from "react";

const EditCoursePage = () => {
  const [error, setError] = useState(null);
  const components = ["CourseEdition", "CourseSectionActivity"];
  const [index, setIndex] = useState(0);
  console.log(index);
  const [showSection, setShowSection] = useState(components[index]);

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleContinue = (index, components) => {
    if (index < components.length - 1) {
      setIndex(index + 1);
      setShowSection(components[index + 1]);
    }
  };
  const handleBack = (index, components) => {
    if (index > 0) {
      setIndex(index - 1);
      setShowSection(components[index - 1]);
    }
  };

  return (
    <ManagementLayout
      button={
        <SaveContinueButton
          text="Siguiente"
          displayIcon={false}
          onClick={
            index < components.length - 1
              ? () => handleContinue(index, components)
              : null
          }
        />
      }
      handleBack={index > 0 ? () => handleBack(index, components) : null}
    >
      {error && <ErrorMessage error={error} />}
      <CourseEditPage
        handleError={handleError}
        showSection={showSection}
        onContinue={handleContinue}
      />
    </ManagementLayout>
  );
};

export default EditCoursePage;
