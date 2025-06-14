import React from "react";
import Image from "next/image";
import styles from "./ResetCenterBrand.module.css";
import logoBlanco from "../../../../../public/LogoBlanco.svg";

const ResetCenterBrand = () => (
  <div className={styles.centerBrand}>
    <Image src={logoBlanco} alt="MentorIA Logo" width={100} height={100} />
    <span className={styles.brandText}>MentorIA</span>
    <span className={styles.welcomeText}>Recuperar contraseña</span>
  </div>
);

export default ResetCenterBrand;
