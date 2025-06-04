import styles from "./WelcomeTextAndButtons.module.css";
import Image from "next/image";
import arrowRight from "../../../../../public/arrowright.png";
import bulb from "../../../../../public/lightball.png";

const WelcomeTextAndButtons = () => (
  <div className={styles.textAndButtons}>
    <h1 className={styles.title}>¡Gracias por unirte a MentorIA!</h1>
    <p className={styles.subtitle}>
      Asistencia inteligente, resultados humanos.
    </p>
    <div className={styles.ctaButtonsRow}>
      <button className={styles.ctaButton}>
        Comenzar
        <Image
          src={arrowRight}
          alt="Comenzar"
          width={22}
          height={22}
          className={styles.ctaIcon}
        />
      </button>
      <button className={styles.secondaryButton}>
        Saber más
        <Image
          src={bulb}
          alt="Saber más"
          width={20}
          height={20}
          className={styles.ctaIcon}
        />
      </button>
    </div>
  </div>
);

export default WelcomeTextAndButtons;
