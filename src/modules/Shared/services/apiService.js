import axios from 'axios';
import { deleteCookie } from '../../../lib/session';

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Use the environment variable for the API URL

export const rGet = async (endpoint, jwt = '') => {
    try {
        const config = jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : {};
        const response = await axios.get(`${API_URL}/${endpoint}`, config);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const rPost = async (endpoint, data, jwt = '') => {
    try {
        const config = jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : {};
        const response = await axios.post(`${API_URL}/${endpoint}`, data, config);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const rPut = async (endpoint, data, jwt = '') => {
    try {
        const config = jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : {};
        const response = await axios.put(`${API_URL}/${endpoint}`, data, config);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const rDelete = async (endpoint, jwt = '') => {
    try {
        const config = jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : {};
        const response = await axios.delete(`${API_URL}/${endpoint}`, config);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

const handleError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 401 && window.location.pathname !== '/login') {
            // Handle unauthorized access
            deleteCookie('authToken'); // Remove the token cookie
            window.location.href = '/login'; // Redirect to login page
        } else {
            console.error('Error:', error.response.data);
        }
    } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.message);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
    }
    return Promise.reject(error); // Return the error
};
