import React from "react";
import SidebarLayout from "../../shared/layouts/sidebarlayout/SidebarLayout";
import UserProfilePage from "../../modules/Usuario/pages/UserProfilePage";
import SidebarBackButton from "../../shared/layouts/components/sidebar/SidebarBackButton";
import SidebarHelpButton from "../../shared/layouts/components/sidebar/SidebarHelpButton";

const UserSettings = () => {
  return (
    <SidebarLayout menuButtons={[SidebarBackButton, SidebarHelpButton]}>
      <UserProfilePage />
    </SidebarLayout>
  );
};

export default UserSettings;
