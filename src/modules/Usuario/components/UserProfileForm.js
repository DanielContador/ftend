import React, { useState, useEffect } from "react";
import styles from "./UserProfileForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPencilAlt,
  faSignOutAlt,
  faUserCircle,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../shared/utils/authProvider";
import { useDispatch } from "react-redux";

const UserProfileForm = ({ user, onSave }) => {
  const { endSession } = useAuth(); // Solo para el botón de cerrar sesión
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [errors, setErrors] = useState({});

  // Sincronizar el estado del formulario con el usuario que llega por props
  useEffect(() => {
    if (user) {
      setFirstName(user.firstname || "");
      setLastName(user.lastname || "");
      setJobTitle(user.jobTitle || "Diseñador instruccional");
    }
  }, [user]);

  const handleSaveChanges = (e) => {
    e.preventDefault();

    // 1. Validar campos vacíos
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "El nombre es requerido.";
    if (!lastName.trim()) newErrors.lastName = "El apellido es requerido.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Si todo es correcto, guardar
      onSave({ firstName, lastName, jobTitle });
      setErrors({}); // Limpiar errores después de un guardado exitoso
    }
  };

  const handleCancel = () => {
    if (user) {
      setFirstName(user.firstname || "");
      setLastName(user.lastname || "");
      setJobTitle(user.jobTitle || "Diseñador instruccional");
      setErrors({});
    }
  };

  return (
    <div className={styles.profileContainer}>
      <header className={styles.header}>
        <div className={styles.avatar}>
          <FontAwesomeIcon icon={faUserCircle} />
        </div>
        <div className={styles.userInfo}>
          <h2>
            {user?.email || "Usuario"}{" "}
            <span className={styles.badge}>Mentor</span>
          </h2>
          <p>{user?.username || "cargando..."}</p>
        </div>
        <button className={styles.logoutButton} onClick={endSession}>
          Cerrar sesión <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </header>

      <main className={styles.content}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>
              <FontAwesomeIcon icon={faIdCard} />
            </span>
            <h3>Información de cuenta</h3>
          </div>
          <div className={styles.infoRow}>
            <label>Dirección de email</label>
            <p>{user?.email || "cargando..."}</p>
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
            <span className={styles.cardIcon}>
              <FontAwesomeIcon icon={faPencilAlt} />
            </span>
            <h3>Editar perfil</h3>
          </div>
          <form onSubmit={handleSaveChanges}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName">Nombres</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={styles.input}
              />
              {errors.firstName && (
                <span className={styles.errorText}>{errors.firstName}</span>
              )}
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="lastName">Apellidos</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={styles.input}
              />
              {errors.lastName && (
                <span className={styles.errorText}>{errors.lastName}</span>
              )}
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="jobTitle">Nombre del Trabajo</label>
              <input
                id="jobTitle"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.blackButton}
                disabled={!firstName.trim() && !lastName.trim()}
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UserProfileForm;
