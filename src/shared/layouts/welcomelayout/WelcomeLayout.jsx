import styles from "./WelcomeLayout.module.css";
import Layout from "./Layout";
import Footer from "./Footer";

const Welcome = ({
  WelcomeTextAndButtons,
  WelcomeRobot,
  WelcomeBottomSection,
}) => {
  return (
    <>
      <Layout>
        <div className={styles.container}>
          <div className={styles.left}>{WelcomeTextAndButtons}</div>
          <div className={styles.right}>{WelcomeRobot}</div>
        </div>
      </Layout>
      <div
        style={{
          minHeight: "1250px",
          width: "100%",
          background: "#fff",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
          {WelcomeBottomSection}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Welcome;
