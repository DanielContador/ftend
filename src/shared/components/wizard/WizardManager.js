import React, { useState } from "react";
import { WizardHeader } from "./WizardHeader";
import { WizardFooter } from "./WizardFooter";

export const WizardManager = ({
  steps,
  initialStep = 0,
  initialFormData = {},
  onFinish,
  validateStep,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState(initialFormData);
  console.log(steps, "steps");

  // Filtra los steps según la condición (si existe)
  const filteredSteps = steps.filter(
    (s) => !s.condition || s.condition(formData)
  );

  const step =
    filteredSteps && filteredSteps.length > 0
      ? filteredSteps[currentStep]
      : undefined;

  let StepComponent = null;
  if (typeof step === "function") {
    StepComponent = step;
  } else if (step && step.component && typeof step.component === "function") {
    StepComponent = step.component;
  }

  // Header tabs únicos por tabLabel (no repite tabs con el mismo nombre)
  const headerTabs = [];
  const seenLabels = new Set();
  filteredSteps.forEach((s) => {
    const tabLabel = s.tabLabel || s.label;
    if (!seenLabels.has(tabLabel)) {
      headerTabs.push({
        key: tabLabel, // Usar tabLabel como key para unicidad visual
        label: tabLabel,
      });
      seenLabels.add(tabLabel);
    }
  });

  // Determina el tab activo según el tabLabel del step actual
  const currentTabLabel = step?.tabLabel || step?.label;
  const currentTabIndex = headerTabs.findIndex(
    (t) => t.label === currentTabLabel
  );

  // Lógica para deshabilitar el botón siguiente
  let isNextDisabled = false;
  if (typeof validateStep === "function") {
    isNextDisabled = validateStep({ step, formData, currentStep });
  } else if (step && step.key === "resourceType") {
    isNextDisabled =
      formData.resourceType === undefined ||
      formData.resourceType === null ||
      formData.resourceType === "";
  } else if (step && step.key === "publishType") {
    isNextDisabled =
      formData.publishType === undefined ||
      formData.publishType === null ||
      formData.publishType === "";
  } else if (step && step.key === "materialType") {
    isNextDisabled =
      formData.materialType === undefined ||
      formData.materialType === null ||
      formData.materialType === "";
  }

  const handleStepData = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const handleBack = () => {
    if (currentStep > 0) {
      // Elimina del formData los campos agregados en el step actual antes de retroceder
      const prevStep = filteredSteps[currentStep];
      let keysToRemove = [];
      if (prevStep && prevStep.component && prevStep.key) {
        // Por convención, los campos suelen tener el key del step o variantes
        // Puedes personalizar esto si tus componentes usan varios campos
        switch (prevStep.key) {
          case "resourceType":
            keysToRemove = ["resourceType"];
            break;
          case "materialType":
            keysToRemove = ["materialType"];
            break;
          case "themeMaterialType":
            keysToRemove = ["themeMaterial", "themeMaterialFiles"];
            break;
          case "materialEstimatedTime":
            keysToRemove = [
              "materialEstimatedTime",
              "materialStudentProfile",
              "materialContext",
            ];
            break;
          case "publishType":
            keysToRemove = ["publishType"];
            break;
          case "themeType":
            keysToRemove = ["themeType", "themeFiles"];
            break;
          case "topicType":
            keysToRemove = ["courseObjective", "courseTime", "studentProfile"];
            break;
          case "styleType":
            keysToRemove = ["courseStyle", "courseContext"];
            break;
          case "courseMaterialType":
            keysToRemove = ["courseMaterialType", "creditsToUse"];
            break;
          case "requestEvaluation":
            keysToRemove = ["evaluationType"];
            break;
          case "evaluationType":
            keysToRemove = ["evaluationTypeList"];
            break;
          // Agrega más casos según tus steps y campos
          default:
            // Si no hay un caso específico, intenta borrar el campo con el mismo nombre que el key
            keysToRemove = [prevStep.key];
        }
      }
      setFormData((prev) => {
        const newData = { ...prev };
        keysToRemove.forEach((k) => {
          delete newData[k];
        });
        return newData;
      });
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (filteredSteps && currentStep < filteredSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (onFinish) {
      onFinish(formData);
    }
  };

  return (
    <>
      <WizardHeader
        steps={headerTabs}
        currentStep={currentTabIndex}
        onClose={onClose}
      />
      <div
        style={{
          minHeight: 200,
          marginLeft: 20,
          marginRight: 20,
          height: "100%",
        }}
      >
        {StepComponent ? (
          <StepComponent formData={formData} onChange={handleStepData} />
        ) : null}
      </div>
      <WizardFooter
        currentStep={currentStep}
        totalSteps={filteredSteps ? filteredSteps.length : 1}
        onBack={handleBack}
        onNext={handleNext}
        isNextDisabled={isNextDisabled}
      />
    </>
  );
};
