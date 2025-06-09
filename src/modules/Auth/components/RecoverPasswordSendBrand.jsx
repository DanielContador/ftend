import React from "react";
import styles from "./RecoverPasswordSendBrand.module.css";

const RecoverPasswordSendBrand = ({ onHomeClick }) => (
  <div className={styles.card}>
    <div className={styles.title}>
      Recuperación
      <br />
      contraseña
    </div>
    <div className={styles.message}>
      {
        "Revisa tu correo para encontrar el\nenlace de recuperación de contraseña"
      }
    </div>
    <button className={styles.homeButton} onClick={onHomeClick}>
      Volver a home
    </button>
  </div>
);

export default RecoverPasswordSendBrand;
