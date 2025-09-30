import SidebarLayout from "../shared/layouts/sidebarlayout/SidebarLayout";
import SidebarHelpButton from "../shared/layouts/components/sidebar/SidebarHelpButton";
import SidebarHomeButton from "../shared/layouts/components/sidebar/SidebarHomeButton";
import HomePage from "../modules/Home/pages/HomePage";

const Home = () => {
  return (
    <SidebarLayout menuButtons={[SidebarHomeButton, SidebarHelpButton]}>
      <HomePage />
    </SidebarLayout>
  );
};

export default Home;
