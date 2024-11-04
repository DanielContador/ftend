import { getCookie } from '../../../lib/session';
import {rGet, rPost, rPut, rDelete} from '../../Shared/services/apiService'; // Importing the apiService

export const getAllCourses = async (endpoint) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet(endpoint, jwt);
};

export const getCourseById = async (endpoint, id) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet(`${endpoint}/${id}`, jwt);
};

export const createCourse = async (endpoint, data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost(endpoint, data, jwt);
};

export const updateCourse = async (endpoint, id, data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPut(`${endpoint}/${id}`, data, jwt);
};

export const deleteCourse = async (endpoint, id) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rDelete(`${endpoint}/${id}`, jwt);
};

export const generateCourseStructure = async (endpoint, courseData) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost(endpoint, courseData, jwt); // Using apiService to make the POST request
};

export const getCourseStructure = async (endpoint, courseId) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet(`${endpoint}/${courseId}`, jwt);
};
