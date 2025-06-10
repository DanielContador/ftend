import React from "react";
import { WizardHeader } from "../../../../shared/components/wizard/WizardHeader";
import { WizardFooter } from "../../../../shared/components/wizard/WizardFooter";
import { WizardManager } from "../../../../shared/components/wizard/WizardManager";
import { courseWizardStepsConfig } from "./courseWizardStepsConfig";
import styles from "./CourseWizard.module.css";

export const CourseWizardOverlay = ({ onClose }) => {
  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <WizardManager
          steps={courseWizardStepsConfig}
          HeaderComponent={WizardHeader}
          FooterComponent={WizardFooter}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};
