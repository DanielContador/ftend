import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/quizzes/`;

const createQuizActivity = async (quizData) => {
    const response = await axios.post(API_URL, quizData);
    return response.data;
};

export default {
    createQuizActivity,
};
