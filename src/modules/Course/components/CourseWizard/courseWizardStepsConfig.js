import { StepResourceType } from "./steps/StepResourceType";
// ...otros imports de steps...

export const courseWizardStepsConfig = [
  {
    key: "resourceType",
    label: "Tipo de recurso",
    component: StepResourceType,
  },
  // ...otros steps...
];
