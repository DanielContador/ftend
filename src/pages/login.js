import AuthLayout from '../shared/layouts/AuthLayout';
import LoginPage from '../modules/Auth/pages/LoginPage';
import Layout from '../shared/layouts/login/layout';

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
