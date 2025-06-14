import React, { useState } from "react";
import { WizardHeader } from "./WizardHeader";
import { WizardFooter } from "./WizardFooter";

export const WizardManager = ({
  steps,
  initialStep = 0,
  initialFormData = {},
  handleFormSubmit,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState(initialFormData);
  const [flow, setFlow] = useState(initialFormData);

  // Filtra los steps según la condición (si existe)
  const filteredSteps = steps.filter((s) => !s.condition || s.condition(flow));

  const step =
    filteredSteps && filteredSteps.length > 0
      ? filteredSteps[currentStep]
      : undefined;

  let StepComponent = null;
  if (step && step.component && typeof step.component === "function") {
    StepComponent = step.component;
  }

  // Header tabs únicos por tabLabel (no repite tabs con el mismo nombre)
  const headerTabs = [];
  const seenLabels = new Set();
  filteredSteps.forEach((s) => {
    const tabLabel = s.tabLabel;
    if (!seenLabels.has(tabLabel)) {
      headerTabs.push({
        key: tabLabel, // Usar tabLabel como key para unicidad visual
        label: tabLabel,
      });
      seenLabels.add(tabLabel);
    }
  });

  // Determina el tab activo según el tabLabel del step actual
  const currentTabLabel = step?.tabLabel;
  const currentTabIndex = headerTabs.findIndex(
    (t) => t.label === currentTabLabel
  );

  // Lógica para deshabilitar el botón siguiente
  let isNextDisabled = true;
  if (step && flow && step.key in flow && flow[step.key].value !== null) {
    isNextDisabled = false;
  }

  const handleStepFormData = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const handleStepFlowData = (stepData) => {
    setFlow((prev) => ({ ...prev, ...stepData }));
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = filteredSteps[currentStep];
      let keysToRemove = flow[prevStep.key].formkeys;
      console.log("Keys to remove:", keysToRemove);
      if (flow && prevStep) {
        flow[prevStep.key] = { value: null, formkeys: [] };
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
            flow={flow}
            formData={formData}
            handleStepFormData={handleStepFormData}
            handleStepFlowData={handleStepFlowData}
            handleFormSubmit={handleFormSubmit}
            onClose={onClose}
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
