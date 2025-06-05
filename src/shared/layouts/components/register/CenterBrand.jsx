import React from "react";
import styles from "./CenterBrand.module.css";

const CenterBrand = () => (
  <div className={styles.centerBrand}>
    <span className={styles.brandText}>MentorIA</span>
    <span className={styles.welcomeText}>
      ¡Bienvenido
      <br />
      a Robot de Cursos DL!
      <br />
      <span className={styles.registerText}>Registrate para comenzar</span>
    </span>
  </div>
);

export default CenterBrand;
