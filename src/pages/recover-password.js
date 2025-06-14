import SplitLayout from "../shared/layouts/splitlayout/SplitLayout";
import RecoverCenterBrand from "../modules/Auth/components/recover/RecoverCenterBrand";
import RecoverPasswordPage from "../modules/Auth/pages/RecoverPasswordPage";

const RecoverPassword = () => {
  return (
    <SplitLayout
      centerComponent={<RecoverCenterBrand />}
      children={<RecoverPasswordPage />}
    ></SplitLayout>
  );
};

export default RecoverPassword;
