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

      const isMaterial =
        flow?.resourceType?.value === "Material" ||
        flow?.resourceType === "Material";
      const generatedCourseId = response.courseId;

      dispatch(setActualComponent("CourseEdition"));
      router.push(
        `/course/${generatedCourseId}/edit?${
          isMaterial ? "material" : "course"
        }`
      );
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
