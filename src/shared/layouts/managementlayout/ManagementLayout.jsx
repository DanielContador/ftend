import styles from "./ManagementLayout.module.css";
import Header from "./Header";

const ManagementLayout = ({ children, button }) => (
  <div className={styles.root}>
    <Header button={button} />
    <main className={styles.body}>{children}</main>
  </div>
);

export default ManagementLayout;
