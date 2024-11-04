import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('authToken');
        if (token) {
            setIsLoggedIn(true);
        }
        setIsLoading(false);
    }, []);

    const initSession = (token) => {
        Cookies.set('authToken', token);
        setIsLoggedIn(true);
    };

    const endSession = () => {
        console.log('removing authToken....');
        Cookies.remove('authToken');
        setIsLoggedIn(false);
        window.location.href = '/login'; // Redirect to login page
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, initSession, endSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
