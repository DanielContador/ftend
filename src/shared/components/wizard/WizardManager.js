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
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  const step = steps && steps.length > 0 ? steps[currentStep] : undefined;

  let StepComponent = null;
  if (typeof step === "function") {
    StepComponent = step;
  } else if (step && step.component && typeof step.component === "function") {
    StepComponent = step.component;
  }

  const handleStepData = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleNext = () => {
    if (steps && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (onFinish) {
      onFinish(formData);
    }
  };

  const handleNextDisabled = (value) => {
    setIsNextDisabled(value);
  };

  return (
    <>
      <WizardHeader steps={steps} currentStep={currentStep} onClose={onClose} />
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
            handleNextDisabled={handleNextDisabled}
          />
        ) : null}
      </div>
      <WizardFooter
        currentStep={currentStep}
        totalSteps={steps ? steps.length : 1}
        onBack={handleBack}
        onNext={handleNext}
        isNextDisabled={isNextDisabled}
      />
    </>
  );
};
