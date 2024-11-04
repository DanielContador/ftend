import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/user/`;

const login = async (credentials) => {
    const response = await axios.post(`${API_URL}login`, credentials);
    if (response.status !== 200) {
        throw new Error('Invalid credentials');
    }

    const data = response.data;
    return data.token;
};

export default {
    login,
};
