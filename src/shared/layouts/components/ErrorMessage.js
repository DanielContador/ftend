import React from 'react';
import styles from './ErrorMessage.module.css'; // Assuming a CSS file for styles

const ErrorMessage = ({ error }) => {
    return (
        <div className={styles.errorMessage}>{error}</div>
    );
};

export default ErrorMessage;
