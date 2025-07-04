import Link from "next/link";
import styles from "./Header.module.css";
import Image from "next/image";
import MentorIALogoBlanco from "../../../../public/MentorIALogoBlanco.svg";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image
          src={MentorIALogoBlanco}
          alt="Robot MentorIA"
          style={{ objectFit: "contain" }}
        />
      </div>
      <nav className={styles.nav}>
        {/* <Link href="/">Inicio</Link> */}
        <Link href="https://www.dl.cl/">Nosotros</Link>
        <Link href="/help">Contacto</Link>
        <Link href="/login" className={styles.loginButton}>
          Iniciar Sesión
        </Link>
      </nav>
    </header>
  );
};

export default Header;
