import CourseLayout from "../../../../../shared/layouts/CourseLayout"; // Importing CourseLayout
import { useRouter } from "next/router";
import ErrorMessage from "../../../../../shared/layouts/components/ErrorMessage"; // Importing ErrorMessage
import { useState } from "react";
import EditActivityPage from "../../../../../modules/Activity/pages/EditActivityPage"; // Importing EditActivityPage
import ManagementLayout from "../../../../../shared/layouts/managementlayout/ManagementLayout";
import SaveContinueButton from "../../../../../shared/layouts/components/management/SaveContinueButton"; // Importing SaveContinueButton

const ActivityEditorPage = () => {
  const router = useRouter();
  const { courseId } = router.query;
  const { id, format } = router.query; // Destructure id and type from query parameters
  const [error, setError] = useState(null); // State to hold error messages

  console.log("type", format);
  console.log("id", id);
  // Example error handling logic
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  // return (
  //     <CourseLayout courseId={courseId} currentPage="ActivityEditorPage" backButtonEndpoint={`/course/${courseId}/edit/course-structure`}>
  //         {error && <ErrorMessage error={error} />} {/* Display error message if exists */}
  //         <EditActivityPage courseId={courseId} id={id} format={format} handleError={handleError} /> {/* Render EditActivityPage */}
  //     </CourseLayout>
  // );
  return (
    <ManagementLayout
      button={<SaveContinueButton text="Siguiente" displayIcon={false} />}
    >
      {error && <ErrorMessage error={error} />}
      <EditActivityPage
        courseId={courseId}
        id={id}
        format={format}
        handleError={handleError}
      />{" "}
      {/* Render EditActivityPage */}
    </ManagementLayout>
  );
};

export default ActivityEditorPage;
