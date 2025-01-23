import React from 'react';
import styles from './UploadDocumentPopup.module.css';

const UploadDocumentPopup = ({ isOpen, onClose, onUpload, title, message }) => {
    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        onUpload(file);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <h2>{title}</h2>
                <p>{message}</p>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default UploadDocumentPopup;
