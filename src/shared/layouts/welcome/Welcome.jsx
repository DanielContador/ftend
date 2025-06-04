import styles from "./Welcome.module.css";
import Layout from "./Layout";
import Image from "next/image";
import robotImg from "../../../../public/robot.png";

const Welcome = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.left}>
          <h1>¡Gracias por unirte a MentorIA!</h1>
          <p>
            Tu plan ha sido activado. Estamos listos para ayudarte a crear
            contenido de forma rápida e inteligente.
          </p>
          <button className={styles.cta}>Comenzar a crear →</button>
        </div>
        <div className={styles.right}>
          <div className={styles.robotWrapper}>
            <Image
              src={robotImg}
              alt="Robot MentorIA"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Welcome;
