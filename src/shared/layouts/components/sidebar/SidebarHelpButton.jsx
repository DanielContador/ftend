import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

const SidebarHelpButton = ({ className }) => {
  return (
    <button className={className} onClick={() => router.push("/help")}>
      <FontAwesomeIcon
        icon={faQuestionCircle}
        style={{ fontSize: 22, color: "#fff", marginRight: 8 }}
      />
      <span>Help</span>
    </button>
  );
};

export default SidebarHelpButton;
