import { getCookie } from '../../../lib/session';
import { rDelete, rPut } from '../../../shared/services/apiService'; // Importing the apiService

export const deleteTopic = async (endpoint, id) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rDelete(`${endpoint}/${id}`, jwt);
};

export const deleteActivity = async (endpoint, id) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rDelete(`${endpoint}/${id}`, jwt);
};

export const updateModuleTitle = async (endpoint, id, moduleData) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPut(`${endpoint}/${id}`, moduleData, jwt);
};
export const updateActivityTitle = async (endpoint, id, activityData) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPut(`${endpoint}/${id}`, activityData, jwt);
};