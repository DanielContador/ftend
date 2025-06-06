import styles from "./SaveContinueButton.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const SaveContinueButton = ({
  onClick,
  text = "Guardar y continuar",
  ...props
}) => (
  <button type="button" className={styles.saveBtn} onClick={onClick} {...props}>
    <FontAwesomeIcon
      icon={faSave}
      style={{ color: "#fff", fontSize: 20, marginRight: 8 }}
    />
    <span>{text}</span>
  </button>
);

export default SaveContinueButton;
