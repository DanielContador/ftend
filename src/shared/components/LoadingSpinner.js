import React from 'react';
import { useSelector } from 'react-redux';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
    const isLoading = useSelector((state) => state.ui.isLoading);

    if (!isLoading) {
        return null;
    }

    return (
        <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
        </div>
    );
};

export default LoadingSpinner;
