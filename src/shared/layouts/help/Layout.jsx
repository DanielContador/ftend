import styles from "./Layout.module.css";
import Image from "next/image";
import LogoBlanco from "../../../../public/LogoBlanco.png";
import mailIcon from "../../../../public/mail.png";

const Layout = ({ children }) => (
  <div className={styles.root}>
    <div className={styles.left}>
      <div className={styles.logoRow}>
        <Image src={LogoBlanco} alt="MentorIA" width={48} height={48} />
        <span className={styles.logoText}>MentorIA</span>
      </div>
      <div className={styles.infoBlock}>
        <h1 className={styles.title}>
          ¿Necesitas ayuda?
          <br />
          Contáctanos!
        </h1>
        <p className={styles.desc}>
          Puedes comunicarte con nosotros vía email directamente o enviarnos un
          boletín sobre la problemática que encontraste.
        </p>
        <div className={styles.emailBox}>
          <div className={styles.emailIcon}>
            <Image src={mailIcon} alt="Email" width={28} height={28} />
          </div>
          <div>
            <div className={styles.emailLabel}>Email</div>
            <div className={styles.emailValue}>contact@brix.com</div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        © 2025 Digital Learning. Todos los derechos reservados.
      </div>
    </div>
    <div className={styles.right}>{children}</div>
  </div>
);

export default Layout;
