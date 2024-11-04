import React from 'react';
import { Route } from 'react-router-dom';
import ScormEditorPage from './ScormEditorPage';

const ScormRoutes = () => {
    return (
        <Route path="/scorm/new" component={ScormEditorPage} />
    );
};

export default ScormRoutes;
