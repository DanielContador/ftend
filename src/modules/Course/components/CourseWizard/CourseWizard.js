import React from "react";
import { WizardManager } from "../../../../shared/components/wizard/WizardManager";
import { courseWizardStepsConfig } from "./courseWizardStepsConfig";
import styles from "./CourseWizard.module.css";

export const CourseWizard = ({ onClose }) => {
  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <WizardManager steps={courseWizardStepsConfig} onClose={handleClose} />
      </div>
    </div>
  );
};
