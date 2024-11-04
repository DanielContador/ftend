import React from 'react';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../modules/Auth/containers/LoginPage';

const Login = () => {
    return (
        <AuthLayout>
            <LoginPage />
        </AuthLayout>
    );
};

export default Login;
