import styles from "./Layout.module.css";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => (
  <div className={styles.root}>
    <Sidebar />
    <div className={styles.content}>{children}</div>
  </div>
);

export default Layout;
