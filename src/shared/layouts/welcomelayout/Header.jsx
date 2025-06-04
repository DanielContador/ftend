import Link from "next/link";
import styles from "./Header.module.css";
import Image from "next/image";
import MentorIALogoBlanco from "../../../../public/MentorIALogoBlanco.png";

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
        <Link href="/">Home</Link>
        <Link href="/about">About Us</Link>
        <Link href="/help">Contact</Link>
        <Link href="/login" className={styles.loginButton}>
          Login
        </Link>
      </nav>
    </header>
  );
};

export default Header;
