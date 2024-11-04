import React from 'react';
import { Route } from 'react-router-dom';
import DocumentEditorPage from './DocumentEditorPage';

const DocumentRoutes = () => {
    return (
        <Route path="/documents/new" component={DocumentEditorPage} />
    );
};

export default DocumentRoutes;
