import styles from "./Welcome.module.css";
import Layout from "./Layout";
import Image from "next/image";
import robotImg from "../../../../public/robot.png";
import WelcomeBottomSection from "./WelcomeBottomSection";
import Footer from "./Footer";
import arrowRight from "../../../../public/arrowright.png";
import bulb from "../../../../public/lightball.png";

const Welcome = () => {
  return (
    <>
      <Layout>
        <div className={styles.container}>
          <div className={styles.left}>
            <h1>¡Gracias por unirte a MentorIA!</h1>
            <p>Asistencia inteligente, resultados humanos.</p>
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
      <WelcomeBottomSection />
      <Footer />
    </>
  );
};

export default Welcome;
