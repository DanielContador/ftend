import styles from "./Footer.module.css";
import Image from "next/image";
import LogoBlanco from "../../../../public/LogoBlanco.png";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.logoBox}>
          <Image
            src={LogoBlanco}
            alt="Logo MentorIA"
            width={80}
            height={80}
            className={styles.logo}
            priority
          />
          <span className={styles.brand}>MentorIA</span>
        </div>
        <div className={styles.textBox}>© 2025 MentorIA · Digital Learning</div>
      </div>
    </footer>
  );
};

export default Footer;
