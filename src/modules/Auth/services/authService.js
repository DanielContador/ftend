import { rPost } from '../../Shared/services/apiService';

const LOGIN_ENDPOINT = 'user/login';

const login = async (credentials, t) => {
    try {
        const data = await rPost(LOGIN_ENDPOINT, credentials);
        return data.token;
    } catch (error) {
        if (error && error.status === 401) {
            throw new Error(t('invalidCredentials')); // Using translation key for invalid credentials
        } else {
            throw new Error(t('internalError')); // Using translation key for internal API errors or connection issues
        }
    }
};

export default {
    login,
};
