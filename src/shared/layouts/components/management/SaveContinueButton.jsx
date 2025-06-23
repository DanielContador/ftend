import styles from "./SaveContinueButton.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const SaveContinueButton = ({
  onClick,
  text = "Guardar y continuar",
  displayIcon = true,
  ...props
}) => (
  <button type="button" className={styles.saveBtn} onClick={onClick} {...props}>
    {displayIcon && (
      <FontAwesomeIcon
        icon={faSave}
        style={{ color: "#fff", fontSize: 20, marginRight: 8 }}
      />
    )}
    <span>{text}</span>
  </button>
);

export default SaveContinueButton;
