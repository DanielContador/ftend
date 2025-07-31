import CourseCreationFormPage from "../../modules/Course/pages/CourseCreationFormPage";
import { useDispatch } from "react-redux";
import { showFloatingError } from "../../shared/store/rootActions";
import SidebarHelpButton from "../../shared/layouts/components/sidebar/SidebarHelpButton";
import SidebarHomeButton from "../../shared/layouts/components/sidebar/SidebarHomeButton";
import SidebarLayout from "../../shared/layouts/sidebarlayout/SidebarLayout";

const NewCoursePage = () => {
  const dispatch = useDispatch();

  const handleError = (errorMessage) => {
    dispatch(showFloatingError(errorMessage));
  };

  return (
    <SidebarLayout menuButtons={[SidebarHomeButton, SidebarHelpButton]}>
      <CourseCreationFormPage handleError={handleError} />
    </SidebarLayout>
  );
};

export default NewCoursePage;
