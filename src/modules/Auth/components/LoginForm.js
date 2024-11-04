import React, { useState } from 'react';
import { useAuth } from '../../../provider/authProvider';
import authService from '../services/authService';
import Button1 from '../../Shared/components/Button1';
import LoadingSpinner from '../../Shared/components/LoadingSpinner'; // Importing the LoadingSpinner component

const LoginForm = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { initSession } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = await authService.login({ username, password });
            initSession(token);
            onLoginSuccess();
        } catch (err) {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <form onSubmit={handleSubmit} style={{ width: '18.75em', padding: '2em', border: '0.0625em solid #ccc', borderRadius: '0.5em', boxShadow: '0 0 0.625em rgba(0, 0, 0, 0.1)' }}>
                <div style={{ marginBottom: '1em' }}>
                    <label style={{ display: 'block', marginBottom: '0.5em' }}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5em', borderRadius: '0.25em', border: '0.0625em solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '1em' }}>
                    <label style={{ display: 'block', marginBottom: '0.5em' }}>Password:</label>
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
                        <Button1 type="submit">Login</Button1> // Using Button1 component
                    )}
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
