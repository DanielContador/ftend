import styles from "./SuccessBox.module.css";
import { useRouter } from "next/router";
const SuccessBox = () => {
  const router = useRouter();
  return (
    <div className={styles.box}>
      <h2 className={styles.title}>¡Gracias!</h2>
      <p className={styles.desc}>
        En breves momentos nos pondremos en contacto contigo
      </p>
      <button onClick={() => router.push("/welcome")} className={styles.button}>
        Volver a home
      </button>
    </div>
  );
};

export default SuccessBox;
