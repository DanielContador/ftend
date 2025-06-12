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
    tabKey: "resource",
    tabLabel: "Tipo de recurso",
    // Este step solo se debe mostrar si resourceType === "curso"
    condition: (formData) => formData.resourceType === "curso",
  },
  {
    key: "themeType",
    label: "Temática Scorm",
    component: StepThemeType,
    tabKey: "themeType",
    tabLabel: "Formulario",
    // Mostrar si publishType es "scorm", "independiente" o "moodle"
    condition: (formData) =>
      ["scorm", "independiente", "moodle"].includes(formData.publishType),
  },
  {
    key: "topicType",
    label: "Formulario",
    component: StepTopicType,
    tabKey: "formulario",
    tabLabel: "Formulario",
    // Se muestra si publishType es "scorm", "independiente" o "moodle" y ya se llenó el campo themeType
    condition: (formData) =>
      ["scorm", "independiente", "moodle"].includes(formData.publishType) &&
      typeof formData.themeType === "string" &&
      formData.themeType.trim() !== "",
  },
  {
    key: "styleType",
    label: "Formulario",
    component: StepStyleType,
    tabKey: "formulario",
    tabLabel: "Formulario",
    // Se muestra si publishType es "scorm", "independiente" o "moodle" y ya se llenó algún campo de topicType
    condition: (formData) =>
      ["scorm", "independiente", "moodle"].includes(formData.publishType) &&
      ((typeof formData.courseObjective === "string" &&
        formData.courseObjective.trim() !== "") ||
        (typeof formData.courseTime === "string" &&
          formData.courseTime.trim() !== "") ||
        (typeof formData.studentProfile === "string" &&
          formData.studentProfile.trim() !== "")),
  },
  {
    key: "courseMaterialType",
    label: "Formulario",
    component: StepCourseMaterialType,
    tabKey: "formulario",
    tabLabel: "Formulario",
    // Se muestra si publishType es "scorm", "independiente" o "moodle" y ya se llenó el campo courseStyle
    condition: (formData) =>
      ["scorm", "independiente", "moodle"].includes(formData.publishType) &&
      typeof formData.courseStyle === "string" &&
      formData.courseStyle.trim() !== "",
  },
  {
    key: "requestEvaluation",
    label: "Evaluación",
    component: StepRequestEvaluation,
    tabKey: "evaluacion",
    tabLabel: "Evaluación",
    // Se muestra si publishType es "scorm", "independiente" o "moodle" y ya se seleccionó al menos un tipo de material
    condition: (formData) =>
      ["scorm", "independiente", "moodle"].includes(formData.publishType) &&
      Array.isArray(formData.courseMaterialType) &&
      formData.courseMaterialType.length > 0,
  },
  {
    key: "evaluationType",
    label: "Tipo de evaluación",
    component: StepEvaluationType,
    tabKey: "evaluacion",
    tabLabel: "Evaluación",
    // Se muestra si publishType es "scorm", "independiente" o "moodle" y se seleccionó "add" en requestEvaluation
    condition: (formData) =>
      ["scorm", "independiente", "moodle"].includes(formData.publishType) &&
      formData.evaluationType === "add",
  },
  {
    key: "courseGeneration",
    label: "Crear",
    component: StepCourseGeneration,
    tabKey: "crear",
    tabLabel: "Crear",
    // Se muestra si publishType es "scorm", "independiente" o "moodle" y ya se seleccionó al menos un tipo de evaluación
    condition: (formData) =>
      ["scorm", "independiente", "moodle"].includes(formData.publishType) &&
      Array.isArray(formData.evaluationTypeList) &&
      formData.evaluationTypeList.length > 0,
  },
];
