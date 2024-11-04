import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import AuthRoutes from '../modules/Auth/routes';
import CourseRoutes from '../modules/Course/routes';
import VideoRoutes from '../modules/ActivityVideo/routes';
import ScormRoutes from '../modules/ActivityScorm/routes';
import DocumentRoutes from '../modules/ActivityDocument/routes';
import QuizRoutes from '../modules/ActivityQuiz/routes';
import UserRoutes from '../modules/Usuario/routes';

const Routes = () => {
    return (
        <Router>
            <Switch>
                <AuthRoutes />
                <CourseRoutes />
                <VideoRoutes />
                <ScormRoutes />
                <DocumentRoutes />
                <QuizRoutes />
                <UserRoutes />
            </Switch>
        </Router>
    );
};

export default Routes;
