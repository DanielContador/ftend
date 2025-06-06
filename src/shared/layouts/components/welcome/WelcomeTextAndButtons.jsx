import styles from "./WelcomeTextAndButtons.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faLightbulb } from "@fortawesome/free-solid-svg-icons";

const WelcomeTextAndButtons = () => (
  <div className={styles.textAndButtons}>
    <h1 className={styles.title}>¡Gracias por unirte a MentorIA!</h1>
    <p className={styles.subtitle}>
      Asistencia inteligente, resultados humanos.
    </p>
    <div className={styles.ctaButtonsRow}>
      <button className={styles.ctaButton}>
        <span className={styles.ctaButtonContent}>
          Comenzar
          <FontAwesomeIcon icon={faArrowRight} className={styles.ctaIcon} />
        </span>
      </button>
      <button className={styles.secondaryButton}>
        <span className={styles.ctaButtonContent}>
          Saber más
          <FontAwesomeIcon icon={faLightbulb} className={styles.ctaIcon} />
        </span>
      </button>
    </div>
  </div>
);

export default WelcomeTextAndButtons;
