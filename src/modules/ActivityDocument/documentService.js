import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/documents/`;

const createDocumentActivity = async (documentData) => {
    const response = await axios.post(API_URL, documentData);
    return response.data;
};

export default {
    createDocumentActivity,
};
