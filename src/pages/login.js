import AuthLayout from "../shared/layouts/AuthLayout";
import LoginPage from "../modules/Auth/pages/LoginPage";
import SplitLayout from "../shared/layouts/splitlayout/SplitLayout";
import CenterBrand from "../shared/layouts/components/login/CenterBrand";
import LogoBlanco from "../../public/LogoBlanco.png"; // Ajusta el path si es necesario

const Login = () => {
  return (
    <SplitLayout
      centerComponent={
        <CenterBrand logo={LogoBlanco} text="MentorIA" alt="MentorIA" />
      }
    >
      <LoginPage />
    </SplitLayout>
  );
};

export default Login;
