import styles from "./Layout.module.css";

const HelpInfo = () => (
  <div>
    <h1 className={styles.title}>
      ¿Necesitas ayuda?
      <br />
      Contáctanos!
    </h1>
    <p className={styles.desc}>
      Puedes comunicarte con nosotros vía email directamente o enviarnos un
      boletín sobre la problemática que encontraste.
    </p>
  </div>
);

export default HelpInfo;
