import styles from "./Layout.module.css";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="d-flex">
      <div className="w-50">
        <div className={styles.container}>
          <Header />
          <main className={styles.main}></main>
          <Footer />
        </div>
      </div>
      <div className="w-50">
        <header className="my-5"></header>
        <main className={styles.main}>{children}</main>
        <footer></footer>
      </div>
    </div>
  );
};

export default Layout;
