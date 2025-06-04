import styles from "./Layout.module.css";
import Image from "next/image";
import mailIcon from "../../../../../public/mail.png";

const HelpEmailBox = () => (
  <div className={styles.emailBox}>
    <div className={styles.emailIcon}>
      <Image src={mailIcon} alt="Email" width={28} height={28} />
    </div>
    <div>
      <div className={styles.emailLabel}>Email</div>
      <div className={styles.emailValue}>contact@brix.com</div>
    </div>
  </div>
);

export default HelpEmailBox;
