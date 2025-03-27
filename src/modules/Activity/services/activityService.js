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

export const getElaiVideoVoiceOptions = async () => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet('video/voices', jwt);
};

export const getVideogenVideoVoiceOptions = async () => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet('video/videogen-voices', jwt);
};

export const getElaiVideoAvatarOptions = async () => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet('video/avatars', jwt);
};

export const updateAudioContent = async (activityId, data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPut(`audio/${activityId}`, data, jwt);
};

export const generateActivityAudio = async (data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost('ActivityContent/generate-audio', data, jwt);
};

export const generateAudioScript = async (data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost('ActivityContent/generate-guion', data, jwt);
};

export const regenerateAudioScript = async (data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost('ActivityContent/regenerate-guion', data, jwt);
};

export const getActivityVideo = async (id) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet(`Activity/videos/${id}`, jwt);
};

export const generateVideoScript = async (data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost('ActivityVideo/generate-guion', data, jwt);
};

export const regenerateVideoScript = async (data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost('ActivityVideo/regenerate-guion', data, jwt);
};

export const retrieveElaiActivityVideoStatus = async (activityId) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet(`ActivityVideo/elai/retrieve/${activityId}`, jwt);
};

export const retrieveVideogenActivityVideoStatus = async (activityId) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet(`ActivityVideo/videogen/retrieve/${activityId}`, jwt);
};

export const generateElaiActivityVideo = async (data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost(`ActivityVideo/elai/create-video`, data, jwt);
};

export const generateVideogenActivityVideo = async (data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost(`ActivityVideo/videogen/create-video`, data, jwt);
};

export const updateVideoContent = async (activityId, data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPut(`video/${activityId}`, data, jwt);
};

export const getActivityPPT = async (id) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet(`Activity/ppt/${id}`, jwt);
};

export const generateActivityPPT = async (data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPost('ActivityPPT/generate', data, jwt);
};

export const getPPTTemplates = async () => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet('ActivityPPT/templates', jwt);
};

export const retrieveActivityPPTStatus = async (activityId) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rGet(`ActivityPPT/retrieve/${activityId}`, jwt);
};

export const editPPTContent = async (data) => {
    const jwt = getCookie('authToken'); // Retrieve the authToken
    return await rPut('ActivityPPT/edit', data, jwt);
};