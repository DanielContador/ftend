import React from 'react';

const ContentLayout = ({ children }) => {
    return (
        <div>
            <header>
                <h1>Content</h1>
            </header>
            <main>{children}</main>
        </div>
    );
};

export default ContentLayout;
