import styles from "./SidebarLayout.module.css";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const SidebarLayout = ({ children, menuButtons, showUserProfile = true }) => (
  <div className={styles.root}>
    <Sidebar menuButtons={menuButtons} showUserProfile={showUserProfile} />
    <div className={styles.content}>
      {children}
      <Footer />
    </div>
  </div>
);

export default SidebarLayout;
