import SplitLayout from "../shared/layouts/splitlayout/SplitLayout";
import CenterBrand from "../shared/layouts/components/password/CenterBrand";
import RecoverPasswordPage from "../modules/Auth/pages/RecoverPasswordPage";

const ChangePasswordPage = () => {
  return (
    <SplitLayout
      centerComponent={<CenterBrand />}
      children={<RecoverPasswordPage />}
    ></SplitLayout>
  );
};

export default ChangePasswordPage;
