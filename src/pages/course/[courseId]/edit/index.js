import ManagementLayout from "../../../../shared/layouts/managementlayout/ManagementLayout";
import ErrorMessage from "../../../../shared/layouts/components/ErrorMessage";
import CourseEditPage from "../../../../modules/Course/pages/CourseEditPage";
import SaveContinueButton from "../../../../shared/layouts/components/management/SaveContinueButton";
import { useState, useEffect } from "react";
// --- REDUX ---
import { useSelector, useDispatch } from "react-redux";
import { showFloatingError } from "../../../../shared/store/rootActions";
import { useRouter } from "next/router";

const EditCoursePage = () => {
  const dispatch = useDispatch();
  const components = ["CourseEdition", "CourseSectionActivity"];
  const [index, setIndex] = useState(0);
  const [showSection, setShowSection] = useState(components[index]);
  const [selectedTab, setSelectedTab] = useState("contenido"); // Estado para la pestaña
  const [isEvaluationAvailable, setIsEvaluationAvailable] = useState(false);
  const [triggerEvaluationView, setTriggerEvaluationView] = useState(false);
  const router = useRouter();

  // Obtener el estado global actualComponent
  const actualComponent = useSelector(
    (state) => state.component.actualComponent
  );

  // Sincroniza el index y showSection con el estado global actualComponent
  useEffect(() => {
    console.log(actualComponent);
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
    dispatch(showFloatingError(errorMessage));
  };

  const handleEvaluationStatusChange = (isAvailable) => {
    setIsEvaluationAvailable(isAvailable);
  };

  const handleContinue = () => {
    if (showSection === "CourseEdition") {
      setIndex(1);
      setShowSection("CourseSectionActivity");
    } else if (showSection === "CourseSectionActivity" && selectedTab === "contenido") {
      if (isEvaluationAvailable) {
        // Trigger evaluation view instead of switching tabs
        setTriggerEvaluationView(true);
        // Reset the trigger after a brief moment to allow for re-triggering
        setTimeout(() => setTriggerEvaluationView(false), 100);
      } else {
        handleError("No hay evaluación en este módulo para poder continuar.");
      }
    }
  };
  const handleBack = () => {
    if (showSection === "CourseSectionActivity") {
      if (selectedTab === "evaluacion") {
        setSelectedTab("contenido");
      } else {
        setIndex(0);
        setShowSection("CourseEdition");
      }
    } else if (showSection === "CourseEdition") {
      router.push("/");
    }
  };

  return (
    <ManagementLayout
      button={
        <SaveContinueButton
          text="Siguiente"
          displayIcon={false}
          onClick={handleContinue}
        />
      }
      handleBack={handleBack}
    >
      <CourseEditPage
        handleError={handleError}
        showSection={showSection}
        onContinue={handleContinue}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        onEvaluationStatusChange={handleEvaluationStatusChange}
        triggerEvaluationView={triggerEvaluationView}
      />
    </ManagementLayout>
  );
};

export default EditCoursePage;
