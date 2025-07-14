import React, { useState } from 'react';
import styles from './UserProfileForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPencilAlt, faSignOutAlt, faUserCircle, faIdCard } from '@fortawesome/free-solid-svg-icons';

const UserProfileForm = () => {
    const [fullName, setFullName] = useState('Soporte TI DL');
    const [jobTitle, setJobTitle] = useState('Diseñador instruccional');

    const handleSaveChanges = (e) => {
        e.preventDefault();
        // Lógica para guardar los cambios
        console.log({ fullName, jobTitle });
    };

    return (
        <div className={styles.profileContainer}>
            <header className={styles.header}>
                <div className={styles.avatar}>
                    <FontAwesomeIcon icon={faUserCircle} />
                </div>
                <div className={styles.userInfo}>
                    <h2>Soporte TI DL <span className={styles.badge}>Mentor</span></h2>
                    <p>Soporte.ti@dl.cl</p>
                </div>
                <button className={styles.logoutButton}>
                    Cerrar sesión <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
            </header>

            <main className={styles.content}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardIcon}><FontAwesomeIcon icon={faIdCard} /></span>
                        <h3>Información de cuenta</h3>
                    </div>
                    <div className={styles.infoRow}>
                        <label>Dirección de email</label>
                        <p>Soporte.ti@dl.cl</p>
                    </div>
                    <div className={styles.infoRow}>
                        <label>Plan actual</label>
                        <p>Pro</p>
                    </div>
                    <div className={styles.cardActions}>
                        <button className={styles.primaryButton}>Cambiar plan</button>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                         <span className={styles.cardIcon}><FontAwesomeIcon icon={faPencilAlt} /></span>
                        <h3>Editar perfil</h3>
                    </div>
                    <form onSubmit={handleSaveChanges}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="jobTitle">Job Title</label>
                            <input
                                id="jobTitle"
                                type="text"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.cardActions}>
                            <button type="button" className={styles.secondaryButton}>Cancelar</button>
                            <button type="submit" className={styles.blackButton}>Guardar cambios</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default UserProfileForm;
