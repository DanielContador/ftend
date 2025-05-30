import React from 'react';
import styles from  './LoadingSpinner.module.css'; // Assuming we will create a CSS file for styles

const LoadingSpinner = () => {
    return (
        <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
        </div>
    );
};

export default LoadingSpinner;
