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
    </header>
  );
};

export default Header;
