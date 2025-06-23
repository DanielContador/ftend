import styles from "./Header.module.css";
import Image from "next/image";
import MentorIALogoBlanco from "../../../../public/MentorIALogoBlanco.svg";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Header = ({ button, handleBack = null }) => {
  const router = useRouter();
  const handleBackClick = () => {
    if (handleBack) {
      handleBack();
    } else {
      router.back();
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Image src={MentorIALogoBlanco} alt="MentorIA" height={40} />
      </div>
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={handleBackClick}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ fontSize: 20, color: "#fff" }}
          />
          <span>Volver</span>
        </button>
        {button}
      </div>
    </header>
  );
};

export default Header;
