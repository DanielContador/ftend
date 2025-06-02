import React from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
    const router = useRouter();

    const handleLoginSuccess = () => {
        router.push('/');
    };

    return (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
    );
};

export default LoginPage;
