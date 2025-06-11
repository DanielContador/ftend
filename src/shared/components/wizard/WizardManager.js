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

  // Header tabs únicos
  const headerTabs = [];
  const seenKeys = new Set();
  filteredSteps.forEach((s) => {
    const tabKey = s.tabKey || s.key || s.label;
    if (!seenKeys.has(tabKey)) {
      headerTabs.push({
        key: tabKey,
        label: s.tabLabel || s.label,
      });
      seenKeys.add(tabKey);
    }
  });

  const currentTabKey = step?.tabKey || step?.key || step?.label;
  const currentTabIndex = headerTabs.findIndex((t) => t.key === currentTabKey);

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
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
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
