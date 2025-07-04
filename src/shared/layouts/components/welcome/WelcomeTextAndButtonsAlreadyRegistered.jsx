import styles from "./WelcomeTextAndButtons.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const WelcomeTextAndButtonsAlreadyRegistered = () => {
  const router = useRouter();

  return (
    <div className={styles.textAndButtons}>
      <h1 className={styles.title}>¡Gracias por unirte a MentorIA!</h1>
      <p className={styles.subtitle}>
        Tu plan ha sido activado. Estamos listos para ayudarte a crear contenido
        de forma rápida e inteligente.
      </p>
      <div className={styles.ctaButtonsRow}>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className={styles.ctaButton}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            Comenzar a crear
            <FontAwesomeIcon icon={faArrowRight} className={styles.ctaIcon} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeTextAndButtonsAlreadyRegistered;
