import React from "react";
import { useRouter } from "next/router";
import { CourseWizardOverlay } from "../components/CourseWizard/CourseWizardOverlay";

const CourseCreationFormPage = ({ handleError }) => {
  const router = useRouter();

  return (
    <CourseWizardOverlay
      onClose={() => {
        router.push("/");
      }}
    />
  );
};

export default CourseCreationFormPage;
