import React from "react";
import Image from "next/image";
import styles from "./ChangeCenterBrand.module.css";
import logoBlanco from "../../../../../public/LogoBlanco.svg";

const ChangeCenterBrand = () => (
  <div className={styles.centerBrand}>
    <Image src={logoBlanco} alt="MentorIA Logo" width={100} height={100} />
    <span className={styles.brandText}>MentorIA</span>
    <span className={styles.welcomeText}>Recuperar contraseña</span>
  </div>
);

export default ChangeCenterBrand;
