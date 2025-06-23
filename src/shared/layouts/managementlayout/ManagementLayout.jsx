import styles from "./ManagementLayout.module.css";
import Header from "./Header";
import Footer from "./Footer";

const ManagementLayout = ({ children, button, handleBack }) => (
  <div className={styles.root}>
    <Header button={button} handleBack={handleBack} />
    <main className={styles.body}>{children}</main>
    <Footer />
  </div>
);

export default ManagementLayout;
