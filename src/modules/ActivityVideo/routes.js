import React from 'react';
import { Route } from 'react-router-dom';
import VideoEditorPage from './VideoEditorPage';

const VideoRoutes = () => {
    return (
        <Route path="/videos/new" component={VideoEditorPage} />
    );
};

export default VideoRoutes;
