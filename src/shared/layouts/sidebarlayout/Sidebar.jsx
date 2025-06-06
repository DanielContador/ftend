import styles from "./Sidebar.module.css";
import Image from "next/image";
import LogoBlanco from "../../../../public/LogoBlanco.svg";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons"; // faSlidersH es el icono de sliders/settings horizontal

const Sidebar = ({ menuButtons }) => {
  const router = useRouter();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.logoRow}>
          <Image src={LogoBlanco} alt="MentorIA" width={44} height={44} />
          <span className={styles.logoText}>MentorIA</span>
        </div>
        <div className={styles.menuBtnGroup}>
          {menuButtons &&
            menuButtons.map((BtnComponent, idx) => (
              <BtnComponent key={idx} className={styles.menuBtn} />
            ))}
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.creditsBox}>
          <div className={styles.creditsHeader}>
            <span>Créditos utilizados</span>
            <span className={styles.creditsValue}>0/100</span>
          </div>
          <div className={styles.creditsBarBg}>
            <div className={styles.creditsBarFill} style={{ width: "0%" }} />
          </div>
        </div>
        <div className={styles.supportBox}>
          <div
            className={styles.supportIcon}
            style={{
              background: "#bdb7e6",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesomeIcon
              icon={faUser}
              style={{ fontSize: 16, color: "#fff" }}
            />
          </div>
          <span className={styles.supportText}>Soporte.ti@dl.cl</span>
          <div className={styles.supportSettings}>
            <FontAwesomeIcon
              icon={faSlidersH}
              style={{ fontSize: 20, color: "#bdb7e6" }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
