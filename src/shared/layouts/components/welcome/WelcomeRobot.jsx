import styles from "./WelcomeRobot.module.css";
import Image from "next/image";
import robotImg from "../../../../../public/robot.svg";

const WelcomeRobot = () => (
  <div className={styles.robotWrapper}>
    <Image
      src={robotImg}
      alt="Robot MentorIA"
      fill
      style={{ objectFit: "contain" }}
    />
  </div>
);

export default WelcomeRobot;
