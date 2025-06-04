import AuthLayout from "../shared/layouts/AuthLayout";
import LoginPage from "../modules/Auth/pages/LoginPage";
import Layout from "../shared/layouts/login/Layout";

const Login = () => {
  // return (
  //     <AuthLayout>
  //         <LoginPage />
  //     </AuthLayout>
  // );
  return (
    <Layout>
      <LoginPage />
    </Layout>
  );
};

export default Login;
