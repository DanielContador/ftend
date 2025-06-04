import styles from "./SplitLayout.module.css";
import Footer from "./Footer";
import Header from "./Header";

const SplitLayout = ({ children, centerComponent }) => {
  return (
    <div className="d-flex">
      <div className="w-50">
        <div className={styles.container}>
          <Header />
          <main className={styles.main}>
            <div className={styles.centered}>{centerComponent}</div>
          </main>
          <Footer />
        </div>
      </div>
      <div className="w-50">
        <header></header>
        <main className={styles.rightMain}>{children}</main>
        <footer></footer>
      </div>
    </div>
  );
};

export default SplitLayout;
