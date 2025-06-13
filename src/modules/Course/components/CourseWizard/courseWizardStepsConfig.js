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
    key: "courseType",
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
    // Cambia la condición a courseType
    condition: (formData) => formData.courseType === "Material",
  },
  {
    key: "themeMaterialType",
    label: "Temática del material",
    component: StepThemeMaterialType,
    tabKey: "formulario",
    tabLabel: "Formulario",
    // Cambia themeMaterial por courseName en la condición
    condition: (formData) =>
      formData.courseType === "Material" &&
      typeof formData.materialType === "string" &&
      formData.materialType.trim() !== "",
  },
  {
    key: "materialEstimatedTime",
    label: "Tiempo estimado y contexto",
    component: StepMaterialEstimatedTime,
    tabKey: "formulario",
    tabLabel: "Formulario",
    // Ahora depende de courseName en vez de themeMaterial
    condition: (formData) =>
      formData.courseType === "Material" &&
      typeof formData.courseName === "string" &&
      formData.courseName.trim() !== "",
  },
  {
    key: "courseGeneration",
    label: "Crear",
    component: StepCourseGeneration,
    tabKey: "crear",
    tabLabel: "Crear",
    // Cambia materialEstimatedTime por estimatedTime
    condition: (formData) =>
      formData.courseType === "Material" &&
      typeof formData.estimatedTime === "string" &&
      formData.estimatedTime.trim() !== "",
  },
  {
    key: "publishType",
    label: "Tipo de publicación",
    component: StepPublishType,
    tabKey: "resource",
    tabLabel: "Tipo de recurso",
    // Cambia la condición a courseGenerationType
    condition: (formData) => formData.courseType === "Curso",
  },
  {
    key: "themeType",
    label: "Temática Scorm",
    component: StepThemeType,
    tabKey: "themeType",
    tabLabel: "Formulario",
    // Ahora la condición depende de courseName en vez de themeType
    condition: (formData) =>
      ["scorm", "internet", "moodle"].includes(formData.courseGenerationType),
  },
  {
    key: "topicType",
    label: "Formulario",
    component: StepTopicType,
    tabKey: "formulario",
    tabLabel: "Formulario",
    // Ajusta la condición para los nuevos nombres de campos
    condition: (formData) =>
      ["scorm", "internet", "moodle"].includes(formData.courseGenerationType) &&
      typeof formData.courseName === "string" &&
      formData.courseName.trim() !== "",
  },
  {
    key: "styleType",
    label: "Formulario",
    component: StepStyleType,
    tabKey: "formulario",
    tabLabel: "Formulario",
    // Se muestra si alguno de los campos de topicType está lleno (con los nuevos nombres)
    condition: (formData) =>
      ["scorm", "internet", "moodle"].includes(formData.courseGenerationType) &&
      ((typeof formData.courseObjective === "string" &&
        formData.courseObjective.trim() !== "") ||
        (typeof formData.estimatedTime === "string" &&
          formData.estimatedTime.trim() !== "") ||
        (typeof formData.participantProfile === "string" &&
          formData.participantProfile.trim() !== "")),
  },
  {
    key: "courseMaterialType",
    label: "Formulario",
    component: StepCourseMaterialType,
    tabKey: "formulario",
    tabLabel: "Formulario",
    // Cambia courseStyle por toneStyle
    // Ya no depende de courseMaterialType, sino de toneStyle
    condition: (formData) =>
      ["scorm", "internet", "moodle"].includes(formData.courseGenerationType) &&
      typeof formData.toneStyle === "string" &&
      formData.toneStyle.trim() !== "",
  },
  {
    key: "requestEvaluation",
    label: "Evaluación",
    component: StepRequestEvaluation,
    tabKey: "evaluacion",
    tabLabel: "Evaluación",
    // Ahora depende de resourceTypes para ambos flujos
    condition: (formData) =>
      ["scorm", "internet", "moodle"].includes(formData.courseGenerationType) &&
      typeof formData.resourceTypes === "string" &&
      formData.resourceTypes.trim() !== "",
  },
  {
    key: "evaluationType",
    label: "Tipo de evaluación",
    component: StepEvaluationType,
    tabKey: "evaluacion",
    tabLabel: "Evaluación",
    // Cambia evaluationTypeList por evaluationMethods
    condition: (formData) =>
      ["scorm", "internet", "moodle"].includes(formData.courseGenerationType) &&
      formData.addActivities === true,
  },
  {
    key: "courseGeneration",
    label: "Crear",
    component: StepCourseGeneration,
    tabKey: "crear",
    tabLabel: "Crear",
    // Cambia evaluationTypeList por evaluationMethods
    condition: (formData) =>
      (["scorm", "internet", "moodle"].includes(
        formData.courseGenerationType
      ) &&
        (formData.addActivities === false ||
          (typeof formData.evaluationMethods === "string" &&
            formData.evaluationMethods.trim() !== ""))) ||
      (formData.courseType === "Material" &&
        typeof formData.materialEstimatedTime === "string" &&
        formData.materialEstimatedTime.trim() !== ""),
  },
];
