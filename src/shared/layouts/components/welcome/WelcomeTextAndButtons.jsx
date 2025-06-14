import styles from "./WelcomeTextAndButtons.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const WelcomeTextAndButtons = () => {
  const router = useRouter();

  return (
    <div className={styles.textAndButtons}>
      <h1 className={styles.title}>¡Gracias por unirte a MentorIA!</h1>
      <p className={styles.subtitle}>
        Asistencia inteligente, resultados humanos.
      </p>
      <div className={styles.ctaButtonsRow}>
        <button
          onClick={() => router.push(`/register`)}
          className={styles.ctaButton}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            Comenzar
            <FontAwesomeIcon icon={faArrowRight} className={styles.ctaIcon} />
          </span>
        </button>
        <button className={styles.secondaryButton}>
          Saber más
          <FontAwesomeIcon icon={faLightbulb} className={styles.ctaIcon} />
        </button>
      </div>
    </div>
  );
};

export default WelcomeTextAndButtons;
