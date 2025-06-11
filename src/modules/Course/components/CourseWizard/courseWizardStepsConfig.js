import { StepResourceType } from "./steps/StepResourceType";
import { StepPublishType } from "./steps/StepPublishType";
import { StepMaterialType } from "./steps/StepMaterialType";
import { StepThemeType } from "./steps/StepThemeType";
// ...otros imports de steps...

export const courseWizardStepsConfig = [
  {
    key: "resourceType",
    label: "Tipo de recurso",
    component: StepResourceType,
    tabKey: "resource", // Tab agrupador
    tabLabel: "Tipo de recurso",
  },
  {
    key: "materialType",
    label: "Tipo de material",
    component: StepMaterialType,
    tabKey: "formulario", // Nuevo tab para el step de material
    tabLabel: "Formulario",
    // Este step solo se debe mostrar si resourceType === "material"
    condition: (formData) => formData.resourceType === "material",
  },
  {
    key: "publishType",
    label: "Tipo de publicación",
    component: StepPublishType,
    tabKey: "resource", // Tab diferente para el step de publicación
    tabLabel: "Tipo de recurso",
    // Este step solo se debe mostrar si resourceType === "curso"
    condition: (formData) => formData.resourceType === "curso",
  },
  {
    key: "themeType",
    label: "Temática Scorm",
    component: StepThemeType,
    tabKey: "themeType", // Cambia el tabKey para que sea único y claro
    tabLabel: "Formulario",
    // Este step solo se debe mostrar si se selecciona "scorm" en el paso de publicación
    condition: (formData) => formData.publishType === "scorm",
  },
];
