import React from "react";
import styles from "./WizardFooter.module.css";

export const WizardFooter = ({
  currentStep = 0,
  totalSteps = 1,
  onBack,
  onNext,
  isNextDisabled,
}) => (
  <div className={styles.footer}>
    <button
      className={styles.backButton}
      onClick={onBack}
      disabled={typeof onBack !== "function" || currentStep === 0}
    >
      ← Atrás
    </button>
    <button
      className={styles.nextButton}
      onClick={onNext}
      disabled={isNextDisabled || currentStep === totalSteps - 1}
    >
      Continuar →
    </button>
  </div>
);
