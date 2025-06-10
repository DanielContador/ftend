// import CourseLayout from "../../shared/layouts/CourseLayout";
// import CourseFormPage from "../../modules/Course/pages/CourseFormPage";
import CourseCreationFormPage from "../../modules/Course/pages/CourseCreationFormPage";
import { useState } from "react";
import ErrorMessage from "../../shared/layouts/components/ErrorMessage"; // Importing ErrorMessage
import SidebarHelpButton from "../../shared/layouts/components/sidebar/SidebarHelpButton";
import SidebarHomeButton from "../../shared/layouts/components/sidebar/SidebarHomeButton";
import SidebarLayout from "../../shared/layouts/sidebarlayout/SidebarLayout";

const NewCoursePage = () => {
  const [error, setError] = useState(null); // State to hold error messages

  // Example error handling logic
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  // return (
  //   <CourseLayout currentPage="NewCoursePage">
  //     {error && <ErrorMessage error={error} />}{" "}
  //     {/* Display error message if exists */}
  //     <CourseFormPage handleError={handleError} />
  //   </CourseLayout>
  // );
  return (
    <SidebarLayout menuButtons={[SidebarHomeButton, SidebarHelpButton]}>
      {error && <ErrorMessage error={error} />}{" "}
      {/* Display error message if exists */}
      <CourseCreationFormPage handleError={handleError} />
    </SidebarLayout>
  );
};

export default NewCoursePage;
