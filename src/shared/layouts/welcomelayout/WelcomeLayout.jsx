import React, { useRef } from "react";
import styles from "./WelcomeLayout.module.css";
import Layout from "./Layout";
import Footer from "./Footer";

// Nuevo prop: onlyLayout (boolean), extraComponent (ReactNode)
const Welcome = ({
  WelcomeTextAndButtons,
  WelcomeRobot,
  WelcomeBottomSection,
  onlyLayout = false,
  extraComponent = null,
}) => {
  const queEsRef = useRef(null);

  const handleSaberMas = () => {
    if (queEsRef.current) {
      const offset = 60; // píxeles de espacio arriba del título
      const elementTop =
        queEsRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementTop - offset,
        behavior: "smooth",
      });
    }
  };

  // Solo clonar si el prop existe y es un elemento válido
  const WelcomeTextAndButtonsWithScroll = WelcomeTextAndButtons
    ? React.isValidElement(WelcomeTextAndButtons)
      ? React.cloneElement(WelcomeTextAndButtons, {
          onSaberMas: handleSaberMas,
        })
      : WelcomeTextAndButtons
    : null;

  const WelcomeBottomSectionWithRef = WelcomeBottomSection
    ? React.isValidElement(WelcomeBottomSection)
      ? React.cloneElement(WelcomeBottomSection, { queEsRef })
      : WelcomeBottomSection
    : null;

  if (onlyLayout) {
    // Solo muestra el Layout con los componentes principales y extraComponent si se provee
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.left}>{WelcomeTextAndButtonsWithScroll}</div>
          <div className={styles.right}>{WelcomeRobot}</div>
        </div>
        {extraComponent}
      </Layout>
    );
  }

  // Modo normal: muestra todo
  return (
    <>
      <Layout>
        <div className={styles.container}>
          <div className={styles.left}>{WelcomeTextAndButtonsWithScroll}</div>
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
          {WelcomeBottomSectionWithRef}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Welcome;
