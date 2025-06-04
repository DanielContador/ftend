import styles from "./Sidebar.module.css";
import Image from "next/image";
import LogoBlanco from "../../../../public/LogoBlanco.png";
import useravatar from "../../../../public/useravatar.png";
import settings from "../../../../public/settings.png";
import { useRouter } from "next/router";

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
          <div className={styles.supportIcon}>
            <Image src={useravatar} alt="Soporte" width={32} height={32} />
          </div>
          <span className={styles.supportText}>Soporte.ti@dl.cl</span>
          <div className={styles.supportSettings}>
            <Image src={settings} alt="Settings" width={22} height={22} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
