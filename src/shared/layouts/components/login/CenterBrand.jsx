import React from "react";
import Image from "next/image";
import styles from "./CenterBrand.module.css"; // Crea este CSS para centrar contenido

const CenterBrand = ({ logo, text, alt = "Brand" }) => (
  <div className={styles.centerBrand}>
    <Image src={logo} alt={alt} width={96} height={96} />
    <span className={styles.brandText}>{text}</span>
    <span className={styles.welcomeText}>
      Bienvenidos de nuevo
      {"\n"}a Robot de Cursos DL
    </span>
  </div>
);

export default CenterBrand;
