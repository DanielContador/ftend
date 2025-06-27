import ManagementLayout from "../../../../shared/layouts/managementlayout/ManagementLayout";
import ErrorMessage from "../../../../shared/layouts/components/ErrorMessage";
import CourseEditPage from "../../../../modules/Course/pages/CourseEditPage";
import SaveContinueButton from "../../../../shared/layouts/components/management/SaveContinueButton";
import { useState, useEffect } from "react";
// --- REDUX ---
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const EditCoursePage = () => {
  const [error, setError] = useState(null);
  const components = ["CourseEdition", "CourseSectionActivity"];
  const [index, setIndex] = useState(0);
  const [showSection, setShowSection] = useState(components[index]);
  const router = useRouter();

  // Obtener el estado global actualComponent
  const actualComponent = useSelector(
    (state) => state.component.actualComponent
  );

  // Sincroniza el index y showSection con el estado global actualComponent
  useEffect(() => {
    if (actualComponent === "CourseSectionActivity") {
      setIndex(1);
      setShowSection("CourseSectionActivity");
    }
    if (actualComponent === "CourseEdition") {
      setIndex(0);
      setShowSection("CourseEdition");
    }
  }, [actualComponent]);

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
    } else if (index === 0) {
      router.push("/");
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
      handleBack={() => handleBack(index, components)}
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
