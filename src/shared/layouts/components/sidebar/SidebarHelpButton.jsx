import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/router";

const SidebarHelpButton = ({ className }) => {
  const router = useRouter();
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
