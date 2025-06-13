import React, { useState } from "react";
import { WizardHeader } from "./WizardHeader";
import { WizardFooter } from "./WizardFooter";

export const WizardManager = ({
  steps,
  initialStep = 0,
  initialFormData = {},
  onFinish,
  handleFormSubmit,
  validateStep,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState(initialFormData);

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
  } else if (step && step.key === "courseType") {
    isNextDisabled =
      formData.courseType === undefined ||
      formData.courseType === null ||
      formData.courseType === "";
  } else if (step && step.key === "publishType") {
    // Cambia publishType por courseGenerationType
    isNextDisabled =
      formData.courseGenerationType === undefined ||
      formData.courseGenerationType === null ||
      formData.courseGenerationType === "";
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
      const prevStep = filteredSteps[currentStep];
      let keysToRemove = [];
      if (prevStep && prevStep.component && prevStep.key) {
        switch (prevStep.key) {
          case "courseType":
            keysToRemove = ["courseType"];
            break;
          case "materialType":
            keysToRemove = ["resourceTypes"];
            break;
          case "themeMaterialType":
            keysToRemove = ["courseName", "themeMaterialFiles"];
            break;
          case "materialEstimatedTime":
            keysToRemove = [
              "estimatedTime",
              "participantProfile",
              "additionalContext",
            ];
            break;
          case "publishType":
            keysToRemove = ["courseGenerationType"];
            break;
          case "themeType":
            keysToRemove = ["courseName", "themeFiles"];
            break;
          case "topicType":
            keysToRemove = [
              "courseObjective",
              "estimatedTime",
              "participantProfile",
            ];
            break;
          case "styleType":
            keysToRemove = ["toneStyle", "additionalContext"];
            break;
          case "courseMaterialType":
            keysToRemove = ["resourceTypes", "creditsToUse"];
            break;
          case "requestEvaluation":
            keysToRemove = ["addActivities"];
            break;
          case "evaluationType":
            keysToRemove = ["evaluationMethods"];
            break;
          default:
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
          <StepComponent
            formData={formData}
            onChange={handleStepData}
            handleFormSubmit={handleFormSubmit}
          />
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
