import React from "react";
import styles from "./WizardHeader.module.css";

export const WizardHeader = ({ steps = [], currentStep = 0, onClose }) => (
  <div className={styles.header}>
    <div className={styles.tabs}>
      {steps.length > 0 ? (
        steps.map((step, idx) => (
          <div
            key={step.key || idx}
            className={`${styles.tab} ${
              idx === currentStep ? styles.active : ""
            }`}
          >
            {step.label}
          </div>
        ))
      ) : (
        <div className={styles.tab}>Sin pasos</div>
      )}
    </div>
    {onClose && (
      <button className={styles.closeButton} onClick={onClose}>
        ×
      </button>
    )}
  </div>
);
