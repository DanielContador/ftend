import Image from "next/image";
import helpIcon from "../../../../../public/help.png";
import { useRouter } from "next/router";

const SidebarHelpButton = ({ className }) => {
  const router = useRouter();
  return (
    <button className={className} onClick={() => router.push("/help")}>
      <Image src={helpIcon} alt="Help" width={25} height={22} />
      <span>Help</span>
    </button>
  );
};

export default SidebarHelpButton;
