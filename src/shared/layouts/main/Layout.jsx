import styles from "./Layout.module.css";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => (
  <div className={styles.root}>
    <Sidebar />
    <div className={styles.content}>
      {children}
      <Footer />
    </div>
  </div>
);

export default Layout;
