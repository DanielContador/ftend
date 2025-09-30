import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import CourseListFormPage from "../../Course/pages/CourseListFormPage";
import { showFloatingError } from "../../../shared/store/rootActions";
import { useAuth } from "../../../shared/utils/authProvider";

const HomePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  const handleError = (errorMessage) => {
    dispatch(showFloatingError(errorMessage));
  };

  return <CourseListFormPage handleError={handleError} />;
};

export default HomePage;
