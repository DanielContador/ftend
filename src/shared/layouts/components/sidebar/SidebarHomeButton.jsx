import Image from "next/image";
import home from "../../../../../public/home.png";
import { useRouter } from "next/router";

const SidebarHomeButton = ({ className }) => {
  const router = useRouter();
  return (
    <button className={className} onClick={() => router.back()}>
      <Image src={home} alt="Home" width={22} height={22} />
      <span>Home</span>
    </button>
  );
};

export default SidebarHomeButton;
