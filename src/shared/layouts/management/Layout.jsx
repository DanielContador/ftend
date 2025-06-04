import styles from "./Layout.module.css";
import Header from "./Header";

const Layout = ({ children }) => (
  <div className={styles.root}>
    <Header />
    <main className={styles.body}>{children}</main>
  </div>
);

export default Layout;
