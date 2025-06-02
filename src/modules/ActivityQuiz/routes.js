import React from 'react';
import { Route } from 'react-router-dom';
import QuizEditorPage from './pages/QuizEditorPage';

const QuizRoutes = () => {
    return (
        <Route path="/quizzes/new" component={QuizEditorPage} />
    );
};

export default QuizRoutes;
