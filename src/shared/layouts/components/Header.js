import React from 'react';
import { useAuth } from '../../utils/authProvider';
import styles from './Header.module.css';
import Button2 from '../../components/Button2';
import logo from '../../../../public/logo-dark.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const { endSession } = useAuth();

    const handleLogout = () => {
        endSession(); // Call the logout function from the context
    };

    return (
        <header className={styles.header}>
            <img src={logo.src} alt="Logo" className={styles.headerLogo} /> {/* Logo with specified height */}
            <Button2 onClick={handleLogout} className={styles.logoutButton}>
                <FontAwesomeIcon icon={faSignOutAlt} className={styles.logoutIcon} />
            </Button2>
        </header>
    );
};

export default Header;
