import React from "react";
import { useRouter } from "next/router";
import { CourseWizard } from "../components/CourseWizard/CourseWizard";
import courseContentAIService from "../services/courseContentAIService";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setActualComponent } from "../../../shared/store/rootActions";

const CourseCreationFormPage = ({ handleError }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleFormSubmit = async (formData, flow) => {
    try {
      const response = await courseContentAIService.generateCourseStructure(
        formData,
        "/generate-course-structure"
      );

      // Usa flow para determinar si es curso o material
      const isMaterial =
        flow?.resourceType?.value === "Material" ||
        flow?.resourceType === "Material";
      if (!isMaterial) {
        // Es curso: redirige a CourseEdition (no CourseSectionActivity)
        const generatedCourseId = response.courseId;
        dispatch(setActualComponent("CourseEdition"));
        router.push(`/course/${generatedCourseId}/edit`);
      } else {
        // Es material, obtener el activityId del primer módulo y learning_object
        const courseId =
          response.courseId ||
          response.data?.courseId ||
          response.data?.course_id;
        const format =
          formData?.resourceTypes ||
          formData?.format ||
          response.format ||
          response.data?.format;
        // Fetch la estructura del curso para obtener el activityId
        const courseStructureResp =
          await courseContentAIService.getCourseStructure(
            courseId,
            "/course-structure"
          );
        const courseStructure = courseStructureResp.courseStructure;
        // Buscar el primer módulo y el primer learning_object
        let activityId = null;
        if (
          courseStructure &&
          Array.isArray(courseStructure.modules) &&
          courseStructure.modules.length > 0
        ) {
          const firstModule = courseStructure.modules[0];
          if (
            firstModule &&
            Array.isArray(firstModule.learning_objects) &&
            firstModule.learning_objects.length > 0
          ) {
            activityId = firstModule.learning_objects[0].id;
          }
        }
        if (courseId && activityId && format) {
          router.push(
            `/course/${courseId}/edit/activity/?id=${activityId}&format=${format}`
          );
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error generating course structure:", error);
      handleError(t("generateCourseStructureError"));
    }
  };

  return (
    <CourseWizard
      handleFormSubmit={handleFormSubmit}
      onClose={() => {
        router.push("/");
      }}
    />
  );
};

export default CourseCreationFormPage;
