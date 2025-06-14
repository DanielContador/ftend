import LoginPage from "../modules/Auth/pages/LoginPage";
import SplitLayout from "../shared/layouts/splitlayout/SplitLayout";
import CenterBrand from "../modules/Auth/components/login/CenterBrand";

const Login = () => {
  return (
    <SplitLayout
      centerComponent={<CenterBrand text="MentorIA" />}
      children={<LoginPage />}
    ></SplitLayout>
  );
};

export default Login;
