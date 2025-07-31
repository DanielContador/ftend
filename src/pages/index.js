import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { showFloatingError } from "../shared/store/rootActions";
import { useAuth } from "../shared/utils/authProvider";
import CourseListFormPage from "../modules/Course/pages/CourseListFormPage";
import SidebarLayout from "../shared/layouts/sidebarlayout/SidebarLayout";
import { useTranslation } from "react-i18next"; // Importing useTranslation
import SidebarHelpButton from "../shared/layouts/components/sidebar/SidebarHelpButton";
import SidebarHomeButton from "../shared/layouts/components/sidebar/SidebarHomeButton";

const HomePage = () => {
  const { t } = useTranslation(); // Using the translation hook
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return <div>{t("loading")}</div>; // Using translation key for loading message
  }

  const handleError = (errorMessage) => {
    dispatch(showFloatingError(errorMessage));
  };

  return (
    <SidebarLayout menuButtons={[SidebarHomeButton, SidebarHelpButton]}>
      <CourseListFormPage handleError={handleError} />
    </SidebarLayout>
  );
};

export default HomePage;
