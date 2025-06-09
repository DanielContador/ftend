import React from "react";
import Image from "next/image";
import styles from "./CenterBrand.module.css";
import LogoBlanco from "../../../../../public/LogoBlanco.svg"; // Ajusta el path si es necesario

const CenterBrand = () => (
  <div className={styles.centerBrand}>
    <span className={styles.brandText}>MentorIA</span>
    <span className={styles.welcomeText}>
      Bienvenidos de nuevo
      <br />a Robot de Cursos DL
    </span>
  </div>
);

export default CenterBrand;
