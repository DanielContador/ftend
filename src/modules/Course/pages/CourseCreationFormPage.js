import React from "react";
import { useRouter } from "next/router";
import { CourseWizard } from "../components/CourseWizard/CourseWizard";

const CourseCreationFormPage = ({ handleError }) => {
  const router = useRouter();

  return (
    <CourseWizard
      onClose={() => {
        router.push("/");
      }}
    />
  );
};

export default CourseCreationFormPage;
