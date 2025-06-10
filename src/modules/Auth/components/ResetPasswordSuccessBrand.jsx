import React from "react";
import styles from "./ResetPasswordSuccessBrand.module.css";

const ResetPasswordSuccessBrand = ({ onHomeClick }) => (
  <div className={styles.card}>
    <div className={styles.title}>
      Cambiaste tu
      <br />
      contraseña con éxito
    </div>
    <div className={styles.message}>
      ¡Ahora puedes volver a crear recursos
      <br />
      educativos con estilo!
    </div>
    <button className={styles.homeButton} onClick={onHomeClick}>
      Volver a home
    </button>
  </div>
);

export default ResetPasswordSuccessBrand;
