import React from "react";
import { useRouter } from "next/router";
import { CourseWizard } from "../components/CourseWizard/CourseWizard";
import courseContentAIService from "../services/courseContentAIService";
import { useTranslation } from "react-i18next";

const CourseCreationFormPage = ({ handleError }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleFormSubmit = async (formData) => {
    try {
      const response = await courseContentAIService.generateCourseStructure(
        formData,
        "/generate-course-structure"
      );
      const generatedCourseId = response.courseId; // Assuming the response contains the courseId
      // Redirect to the new course structure page with generatedCourseId
      router.push(`/course/${generatedCourseId}/edit/course-structure`);
    } catch (error) {
      console.error("Error generating course structure:", error);
      handleError(t("generateCourseStructureError")); // Using translation key for error message
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
