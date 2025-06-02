import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users/`;

const getUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const getUserById = async (id) => {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
};

export default {
    getUsers,
    getUserById,
};
