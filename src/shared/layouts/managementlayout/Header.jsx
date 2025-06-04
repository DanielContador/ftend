import styles from "./Header.module.css";
import Image from "next/image";
import MentorIALogoBlanco from "../../../../public/MentorIALogoBlanco.png";
import arrowLeft from "../../../../public/arrowleft.png";
import { useRouter } from "next/router";

const Header = ({ button }) => {
  const router = useRouter();
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Image src={MentorIALogoBlanco} alt="MentorIA" height={40} />
      </div>
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={() => router.back()}>
          <Image src={arrowLeft} alt="Volver" width={20} height={20} />
          <span>Volver</span>
        </button>
        {button}
      </div>
    </header>
  );
};

export default Header;
