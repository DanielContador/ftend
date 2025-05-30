import React, { useState } from 'react';
import { useAuth } from '../../../shared/utils/authProvider';
import authService from '../services/authService';
import Button1 from '../../../shared/components/Button1';
import LoadingSpinner from '../../../shared/components/LoadingSpinner'; // Importing the LoadingSpinner component
import { useTranslation } from 'react-i18next'; // Importing useTranslation

const LoginForm = ({ onLoginSuccess }) => {
    const { t } = useTranslation(); // Using the translation hook
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { initSession } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = await authService.login({ username, password }, t); // Pass t to login function
            initSession(token);
            onLoginSuccess();
        } catch (err) {
            setError(err.message); // Using translation key
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <form onSubmit={handleSubmit} style={{ width: '18.75em', padding: '2em', border: '0.0625em solid #ccc', borderRadius: '0.5em', boxShadow: '0 0 0.625em rgba(0, 0, 0, 0.1)' }}>
                <div style={{ marginBottom: '1em' }}>
                    <label style={{ display: 'block', marginBottom: '0.5em' }}>{t('username')}</label> {/* Using translation key */}
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5em', borderRadius: '0.25em', border: '0.0625em solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '1em' }}>
                    <label style={{ display: 'block', marginBottom: '0.5em' }}>{t('password')}</label> {/* Using translation key */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5em', borderRadius: '0.25em', border: '0.0625em solid #ccc' }}
                    />
                </div>
                {error && <p style={{ color: 'red', marginBottom: '1em' }}>{error}</p>}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    {loading ? ( // Show loading indicator
                        <LoadingSpinner />
                    ) : (
                        <Button1 type="submit">{t('login')}</Button1> // Using translation key
                    )}
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
