import styles from "./LoginLayout.module.css";
import Header from "./Header";

const LoginLayout = ({ children }) => {
  return (
    <div className={styles.pageContainer}>
      {/* Decorative gradient circles */}
      <div className={styles.circle1}></div>
      <div className={styles.circle2}></div>
      <div className={styles.circle3}></div>

      {/* Header with logo and navigation */}
      <Header />

      {/* Main content area */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default LoginLayout;
