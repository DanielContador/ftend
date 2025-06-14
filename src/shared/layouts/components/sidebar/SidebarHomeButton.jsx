import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const SidebarHomeButton = ({ className }) => {
  const router = useRouter();
  return (
    <button className={className} onClick={() => router.push(`/`)}>
      <FontAwesomeIcon
        icon={faHome}
        style={{ fontSize: 22, color: "#fff", marginRight: 8 }}
      />
      <span>Home</span>
    </button>
  );
};

export default SidebarHomeButton;
