import SplitLayout from "../shared/layouts/splitlayout/SplitLayout";
import ChangeCenterBrand from "../shared/layouts/components/password/ChangeCenterBrand";
import ChangePasswordPage from "../modules/Auth/pages/ChangePasswordPage";

const ChangePassword = () => {
  return (
    <SplitLayout
      children={<ChangePasswordPage />}
      centerComponent={<ChangeCenterBrand />}
    ></SplitLayout>
  );
};

export default ChangePassword;
