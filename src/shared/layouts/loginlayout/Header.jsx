import Image from "next/image";
import styles from "./Header.module.css";
import MentorIALogo from "../../../../public/MentorIALogoBlanco.svg";
import mentorIAlogocolor from "../../../../public/mentorIAlogocolor.png";
const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image
          src={mentorIAlogocolor}
          alt="MentorIA Logo"
          width={70}
          height={60}
          style={{ objectFit: "contain" }}
        />
      </div>
      <nav className={styles.nav}>
        <a href="#" className={styles.navLink}>Inicio</a>
        <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>Sobre Nosotros</a>
        <a href="#" className={styles.navLink}>Blog</a>
        <a href="#" className={styles.navLink}>Contacto</a>
      </nav>
    </header>
  );
};

export default Header;
