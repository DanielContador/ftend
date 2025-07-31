import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { showFloatingError } from "../../../../../shared/store/rootActions";
import EditActivityPage from "../../../../../modules/Activity/pages/EditActivityPage"; // Importing EditActivityPage
import ManagementLayout from "../../../../../shared/layouts/managementlayout/ManagementLayout";
import SaveContinueButton from "../../../../../shared/layouts/components/management/SaveContinueButton";

const ActivityEditorPage = () => {
  const router = useRouter();
  const { courseId } = router.query;
  const dispatch = useDispatch();

  const handleError = (errorMessage) => {
    dispatch(showFloatingError(errorMessage));
  };

  return (
    <ManagementLayout menuButtons={[SaveContinueButton]}>
      <EditActivityPage courseId={courseId} handleError={handleError} />
    </ManagementLayout>
  );
};

export default ActivityEditorPage;
