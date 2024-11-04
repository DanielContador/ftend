import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/videos/`;

const createVideoActivity = async (videoData) => {
    const response = await axios.post(API_URL, videoData);
    return response.data;
};

export default {
    createVideoActivity,
};
