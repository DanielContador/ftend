import { getCookie } from '../../../lib/session';
import { rGet, rPost, rPut } from '../../Shared/services/apiService'; // Importing the apiService

export const getActivityDocument = async (id) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet(`Activity/documents/${id}`, jwt);
};

export const getActivityAudio = async (id) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet(`Activity/audios/${id}`, jwt);
};

export const generateActivityDocument = async (data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost('ActivityContent/generate-document', data, jwt);
};

export const regenerateActivityDocument = async (data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost('ActivityContent/regenerate-document', data, jwt);
};

export const updateDocumentContent = async (documentId, data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPut(`document/${documentId}/content`, data, jwt);
};

export const getVoiceOptions = async () => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet('audio/voices', jwt);
};

export const updateAudioContent = async (activityId, data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPut(`audio/${activityId}`, data, jwt);
};

export const generateActivityAudio = async (data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost('ActivityContent/generate-audio', data, jwt);
};

export const generateActivityScript = async (data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost('ActivityContent/generate-guion', data, jwt);
};

export const regenerateActivityScript = async (data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost('ActivityContent/regenerate-guion', data, jwt);
};