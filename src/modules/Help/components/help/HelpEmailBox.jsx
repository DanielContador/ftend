import styles from "./Layout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

const HelpEmailBox = () => (
  <div className={styles.emailBox}>
    <div className={styles.emailIcon}>
      <FontAwesomeIcon
        icon={faEnvelope}
        style={{ fontSize: 24, color: "#7d3cff" }}
      />
    </div>
    <div>
      <div className={styles.emailLabel}>Email</div>
      <div className={styles.emailValue}>contact@brix.com</div>
    </div>
  </div>
);

export default HelpEmailBox;
