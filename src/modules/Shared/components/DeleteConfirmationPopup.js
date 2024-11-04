import React from 'react';
import styles from './DeleteConfirmationPopup.module.css'; // Assuming we will create a CSS file for styles

const DeleteConfirmationPopup = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <h2>{title}</h2>
                <p>{message}</p>
                <div className={styles.actions}>
                    <button onClick={onConfirm} className={styles.confirmButton}>Eliminar</button>
                    <button onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationPopup;
