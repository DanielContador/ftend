import RegisterPage from "../modules/Auth/pages/RegisterPage";
import SplitLayout from "../shared/layouts/splitlayout/SplitLayout";
import LogoBlanco from "../../public/LogoBlanco.png"; // Ajusta el path si es necesario
import CenterBrand from "../shared/layouts/components/register/CenterBrand";

const Register = () => {
  return (
    <SplitLayout
      centerComponent={
        <CenterBrand logo={LogoBlanco} text="MentorIA" alt="MentorIA" />
      }
      children={<RegisterPage />}
    ></SplitLayout>
  );
};

export default Register;
