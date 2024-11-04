import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './BackButton.module.css'; // Assuming we will create a CSS file for styles
import { useRouter } from 'next/router'; // Importing useRouter for navigation

const BackButton = ({ endpoint }) => {
    const router = useRouter();
    const handleBack = () => {
        router.push(endpoint); // Navigate to the specified endpoint
    };

    return (
        <button onClick={handleBack} className={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
    );
};

export default BackButton;
