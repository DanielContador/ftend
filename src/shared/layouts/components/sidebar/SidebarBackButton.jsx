import React from "react";
import { useRouter } from "next/router";
import styles from "./SidebarButton.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const SidebarBackButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
      <span>Volver</span>
    </button>
  );
};

export default SidebarBackButton;
