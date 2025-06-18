import { StepResourceType } from "./steps/StepResourceType";
import { StepPublishType } from "./steps/StepPublishType";
import { StepMaterialType } from "./steps/StepMaterialType";
import { StepThemeType } from "./steps/StepThemeType";
import { StepTopicType } from "./steps/StepTopicType";
import { StepStyleType } from "./steps/StepStyleType";
import { StepCourseMaterialType } from "./steps/StepCourseMaterialType";
import { StepRequestEvaluation } from "./steps/StepRequestEvaluation";
import { StepEvaluationType } from "./steps/StepEvaluationType";
import { StepCourseGeneration } from "./steps/StepCourseGeneration";
import { StepThemeMaterialType } from "./steps/StepThemeMaterialType";
import { StepMaterialEstimatedTime } from "./steps/StepMaterialEstimatedTime";

export const courseWizardStepsConfig = [
  {
    key: "resourceType",
    label: "Tipo de recurso",
    component: StepResourceType,
    tabKey: "resource",
    tabLabel: "Tipo de recurso",
  },
  {
    key: "materialType",
    label: "Tipo de material",
    component: StepMaterialType,
    tabKey: "formulario",
    tabLabel: "Formulario",
    condition: (flow) => flow?.resourceType?.value === "Material",
  },
  {
    key: "themeMaterialType",
    label: "Temática del material",
    component: StepThemeMaterialType,
    tabKey: "formulario",
    tabLabel: "Formulario",
    condition: (flow) =>
      flow?.materialType?.value !== null &&
      flow?.materialType?.value !== undefined,
  },
  {
    key: "materialEstimatedTime",
    label: "Tiempo estimado y contexto",
    component: StepMaterialEstimatedTime,
    tabKey: "formulario",
    tabLabel: "Formulario",
    condition: (flow) =>
      flow?.themeMaterialType?.value !== null &&
      flow?.themeMaterialType?.value !== undefined,
  },
  {
    key: "publishType",
    label: "Tipo de publicación",
    component: StepPublishType,
    tabKey: "resource",
    tabLabel: "Tipo de recurso",
    condition: (flow) => flow?.resourceType?.value === "Curso",
  },
  {
    key: "themeType",
    label: "Temática Scorm",
    component: StepThemeType,
    tabKey: "themeType",
    tabLabel: "Formulario",
    condition: (flow) =>
      flow?.publishType?.value !== null &&
      flow?.publishType?.value !== undefined,
  },
  {
    key: "topicType",
    label: "Formulario",
    component: StepTopicType,
    tabKey: "formulario",
    tabLabel: "Formulario",
    condition: (flow) =>
      flow?.themeType?.value !== null && flow?.themeType?.value !== undefined,
  },
  {
    key: "styleType",
    label: "Formulario",
    component: StepStyleType,
    tabKey: "formulario",
    tabLabel: "Formulario",
    condition: (flow) =>
      flow?.topicType?.value !== null &&
      flow?.topicType?.value !== undefined &&
      flow?.topicType?.estimatedTime !== null &&
      flow?.topicType?.estimatedTime !== undefined &&
      flow?.topicType?.courseObjective !== null &&
      flow?.topicType?.courseObjective !== undefined &&
      flow?.topicType?.participantProfile !== null &&
      flow?.topicType?.participantProfile !== undefined,
  },
  {
    key: "courseMaterialType",
    label: "Formulario",
    component: StepCourseMaterialType,
    tabKey: "formulario",
    tabLabel: "Formulario",
    condition: (flow) =>
      flow?.styleType?.value !== null && flow?.styleType?.value !== undefined,
  },
  {
    key: "requestEvaluation",
    label: "Evaluación",
    component: StepRequestEvaluation,
    tabKey: "evaluacion",
    tabLabel: "Evaluación",
    condition: (flow) =>
      flow?.courseMaterialType?.value !== null &&
      flow?.courseMaterialType?.value !== undefined,
  },
  {
    key: "evaluationType",
    label: "Tipo de evaluación",
    component: StepEvaluationType,
    tabKey: "evaluacion",
    tabLabel: "Evaluación",
    condition: (flow) => flow?.requestEvaluation?.value === true,
  },
  {
    key: "courseGeneration",
    label: "Crear",
    component: StepCourseGeneration,
    tabKey: "crear",
    tabLabel: "Crear",
    condition: (flow) =>
      (flow?.evaluationType?.value !== null &&
        flow?.evaluationType?.value !== undefined) ||
      flow?.requestEvaluation?.value === false ||
      (flow?.materialEstimatedTime?.value !== null &&
        flow?.materialEstimatedTime?.value !== undefined &&
        flow?.materialEstimatedTime?.estimatedTime !== null &&
        flow?.materialEstimatedTime?.estimatedTime !== undefined &&
        flow?.materialEstimatedTime?.participantProfile !== null &&
        flow?.materialEstimatedTime?.participantProfile !== undefined),
  },
];
