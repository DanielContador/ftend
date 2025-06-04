import styles from "./SuccessBox.module.css";

const SuccessBox = () => (
  <div className={styles.box}>
    <h2 className={styles.title}>¡Gracias!</h2>
    <p className={styles.desc}>
      En breves momentos nos pondremos en contacto contigo
    </p>
    <button className={styles.button}>Volver a home</button>
  </div>
);

export default SuccessBox;
