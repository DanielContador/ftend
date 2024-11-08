import React from 'react';
import { useTranslation } from 'react-i18next'; // Importing useTranslation
import styles from './Footer.module.css';

const Footer = () => {
    const { t } = useTranslation(); // Using the translation hook

    return (
        <footer className={styles.footer}>
            <p>{t('footerCopyright')}</p> {/* Using translation key */}
        </footer>
    );
};

export default Footer;
