import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/scorm/`;

const createScormActivity = async (scormData) => {
    const response = await axios.post(API_URL, scormData);
    return response.data;
};

export default {
    createScormActivity,
};
