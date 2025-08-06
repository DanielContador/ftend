import { getCookie } from "../../../shared/utils/session";
import { rGet, rPost, rPut } from "../../../shared/services/apiService"; // Importing the apiService

export const getActivityDocument = async (id) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rGet(`Activity/documents/${id}`, jwt);
};

export const getActivityAudio = async (id) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rGet(`Activity/audios/${id}`, jwt);
};

export const generateActivityDocument = async (data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPost("ActivityContent/generate-document", data, jwt);
};

export const regenerateActivityDocument = async (data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPost("ActivityContent/regenerate-document", data, jwt);
};

export const updateDocumentContent = async (documentId, data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPut(`document/${documentId}/content`, data, jwt);
};

export const getVoiceOptions = async () => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rGet("audio/voices", jwt);
};

export const getElaiVideoVoiceOptions = async () => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rGet("video/voices", jwt);
};

export const getVideogenVideoVoiceOptions = async () => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rGet("video/videogen-voices", jwt);
};

export const getElaiVideoAvatarOptions = async () => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rGet("video/avatars", jwt);
};

export const updateAudioContent = async (activityId, data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPut(`audio/${activityId}`, data, jwt);
};

export const generateActivityAudio = async (data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPost("ActivityContent/generate-audio", data, jwt);
};

export const generateAudioScript = async (data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPost("ActivityContent/generate-guion", data, jwt);
};

export const regenerateAudioScript = async (data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPost("ActivityContent/regenerate-guion", data, jwt);
};

export const getActivityVideo = async (id) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rGet(`Activity/videos/${id}`, jwt);
};

export const generateVideoScript = async (data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPost("ActivityVideo/generate-guion", data, jwt);
};

export const regenerateVideoScript = async (data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPost("ActivityVideo/regenerate-guion", data, jwt);
};

export const retrieveActivityVideoStatus = async (
  activityId,
  videoCreatorApp
) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rGet(
    `ActivityVideo/${videoCreatorApp}/retrieve/${activityId}`,
    jwt
  );
};

export const generateElaiActivityVideo = async (data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPost(`ActivityVideo/elai/create-video`, data, jwt);
};

export const generateVideogenActivityVideo = async (data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPost(`ActivityVideo/videogen/create-video`, data, jwt);
};

export const updateVideoContent = async (activityId, data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPut(`video/${activityId}`, data, jwt);
};

export const getActivityPPT = async (id) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rGet(`Activity/ppt/${id}`, jwt);
};

export const generateActivityPPT = async (data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPost("ActivityPPT/generate", data, jwt);
};

export const getPPTTemplates = async () => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rGet("ActivityPPT/templates", jwt);
};

export const retrieveActivityPPTStatus = async (activityId) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rGet(`ActivityPPT/retrieve/${activityId}`, jwt);
};

export const editPPTContent = async (data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPut("ActivityPPT/edit", data, jwt);
};

// SCORM Activity methods
export const generateActivityScorm = async (data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPost("v1/textimage/generate", data, jwt);
};

export const regenerateActivityScorm = async (data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPost("v1/textimage/regenerate", data, jwt);
};

export const getScormByActivityId = async (activityId) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rGet(`activity/textimage/${activityId}`, jwt);
};

export const updateScormByActivityId = async (activityId, data) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPut(`v1/textimage/${activityId}`, data, jwt);
};

export const uploadScormImage = async (activityId, uploadImage) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  
  // Create FormData for file upload
  const formData = new FormData();
  formData.append('activityId', activityId);
  formData.append('uploadImage', uploadImage);
  
  return await rPost("v1/textimage/uploadImage", formData, jwt);
};
