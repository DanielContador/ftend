import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Importing useTranslation
import styles from './FileDownloadManager.module.css';

const FileDownloadManager = ({ courseId }) => {
    const { t } = useTranslation(); // Using the translation hook
    const [selectedFormat, setSelectedFormat] = useState('rawZip');

    const handleDownload = () => {
        if (selectedFormat === 'rawZip') {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/files/descargar-zip/${courseId}`;
            window.open(url, '_blank');
        }
    };

    return (
        <div className={styles.fileDownloadManager}>
            <h2>{t('downloadCourseFiles')}</h2>
            <div className={styles.formatSelector}>
                <label htmlFor="formatSelect">{t('selectFormat')}:</label>
                <select
                    id="formatSelect"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className={styles.formatDropdown}
                >
                    <option value="rawZip">{t('rawZip')}</option>
                </select>
            </div>
            <button onClick={handleDownload} className={styles.downloadButton}>
                {t('download')}
            </button>
        </div>
    );
};

export default FileDownloadManager;
