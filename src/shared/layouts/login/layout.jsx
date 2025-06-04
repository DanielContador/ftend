import styles from "./Layout.module.css";
import Footer from "./Footer";
import Header from "./Header";
import Image from "next/image";
import LogoBlanco from "../../../../public/LogoBlanco.png";

const Layout = ({ children }) => {
  return (
    <div className="d-flex">
      <div className="w-50">
        <div className={styles.container}>
          <Header />
          <main className={styles.main}>
            <div className={styles.centered}>
              <Image
                src={LogoBlanco}
                alt="Robot MentorIA"
                style={{ objectFit: "contain" }}
              />
              <h1 className={styles.title}>MentorIA</h1>
              <h3 className={styles.subtitle}>
                Bienvenido de nuevo a Robot de Cursos DL!
              </h3>
            </div>
          </main>
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
