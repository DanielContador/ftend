import RegisterPage from "../modules/Auth/pages/RegisterPage";
import styles from "../modules/Auth/components/register/RegisterLayout.module.css";
import Image from "next/image";
import MentorIALogoBlanco from "../../public/LogoBlanco.svg";
import mentorIAlogopng from "../../public/mentorIAlogopng.png"; 

const Register = () => {
  return (
    <div className={styles.pageContainer}>
      {/* Decorative gradient circles */}
      <div className={styles.circle1}></div>
      <div className={styles.circle2}></div>
      <div className={styles.circle3}></div>

      {/* Left section with gradient background */}
      <div className={styles.leftSection}>
        {/* Header with navigation */}
        <header className={styles.header}>
          <nav className={styles.nav}>
            <a href="#" className={styles.navLink}>Inicio</a>
            <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>Sobre Nosotros</a>
            <a href="#" className={styles.navLink}>Blog</a>
            <a href="#" className={styles.navLink}>Contacto</a>
          </nav>
        </header>

        {/* Welcome section with logo */}
        <div className={styles.welcomeSection}>
          
          <div className={styles.logoContainer}>
            <Image
              src={mentorIAlogopng}
              alt="MentorIA Logo"
              width={300}
              height={300}
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>

      {/* Right section with register form */}
      <div className={styles.rightSection}>
        <div className={styles.formContainer}>
          <RegisterPage />
        </div>
        <p className={styles.stepIndicator}>Paso 1/3</p>
      </div>
    </div>
  );
};

export default Register;
