import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../shared/utils/authProvider";
import CourseListPage from "../modules/Course/pages/CourseListPage";
import ErrorMessage from "../shared/layouts/components/ErrorMessage";
import SidebarLayout from "../shared/layouts/sidebarlayout/SidebarLayout";
import { useTranslation } from "react-i18next"; // Importing useTranslation
import SidebarHelpButton from "../shared/layouts/components/sidebar/SidebarHelpButton";
import SidebarHomeButton from "../shared/layouts/components/sidebar/SidebarHomeButton";

const HomePage = () => {
  const { t } = useTranslation(); // Using the translation hook
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const [error, setError] = useState(null); // State to hold error messages

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return <div>{t("loading")}</div>; // Using translation key for loading message
  }

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <SidebarLayout menuButtons={[SidebarHomeButton, SidebarHelpButton]}>
      {error && <ErrorMessage error={error} />}{" "}
      {/* Display error message if exists */}
      <CourseListPage handleError={handleError} />
    </SidebarLayout>
  );
};

export default HomePage;
