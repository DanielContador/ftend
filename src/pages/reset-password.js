import SplitLayout from "../shared/layouts/splitlayout/SplitLayout";
import ResetCenterBrand from "../modules/Auth/components/password/ResetCenterBrand";
import ResetPasswordPage from "../modules/Auth/pages/ResetPasswordPage";

const ResetPassword = () => {
  return (
    <SplitLayout
      children={<ResetPasswordPage />}
      centerComponent={<ResetCenterBrand />}
    ></SplitLayout>
  );
};

export default ResetPassword;
