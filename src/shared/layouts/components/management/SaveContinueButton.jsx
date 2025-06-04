import styles from "./SaveContinueButton.module.css";
import Image from "next/image";
import save from "../../../../../public/save.png";

const SaveContinueButton = ({
  onClick,
  text = "Guardar y continuar",
  ...props
}) => (
  <button type="button" className={styles.saveBtn} onClick={onClick} {...props}>
    <Image src={save} alt="Guardar" width={20} height={20} />
    <span>{text}</span>
  </button>
);

export default SaveContinueButton;
