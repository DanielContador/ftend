import React from 'react';
import AuthLayout from '../shared/layouts/AuthLayout';
import LoginPage from '../modules/Auth/pages/LoginPage';

const Login = () => {
    return (
        <AuthLayout>
            <LoginPage />
        </AuthLayout>
    );
};

export default Login;
