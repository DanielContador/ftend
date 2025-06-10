import React, { useState } from "react";

export const WizardManager = ({
  steps,
  initialStep = 0,
  initialFormData = {},
  onFinish,
  validateStep,
  headerProps = {},
  footerProps = {},
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState(initialFormData);

  const step = steps && steps.length > 0 ? steps[currentStep] : undefined;

  let StepComponent = null;
  if (typeof step === "function") {
    StepComponent = step;
  } else if (step && step.component && typeof step.component === "function") {
    StepComponent = step.component;
  }

  let isNextDisabled = false;
  if (typeof validateStep === "function") {
    isNextDisabled = validateStep({ step, formData, currentStep });
  } else if (step && step.key === "resourceType") {
    isNextDisabled = !formData.resourceType;
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

  return (
    <div>
      {HeaderComponent && (
        <HeaderComponent
          steps={steps}
          currentStep={currentStep}
          onClose={onClose}
          {...headerProps}
        />
      )}
      <div style={{ minHeight: 200 }}>
        {StepComponent ? (
          <StepComponent formData={formData} onChange={handleStepData} />
        ) : null}
      </div>
      {FooterComponent && (
        <FooterComponent
          currentStep={currentStep}
          totalSteps={steps ? steps.length : 1}
          onBack={handleBack}
          onNext={handleNext}
          isNextDisabled={isNextDisabled}
          {...footerProps}
        />
      )}
    </div>
  );
};
