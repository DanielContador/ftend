import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import loginService from "../services/loginService";
import { useAuth } from "../../../shared/utils/authProvider";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation();
  const { initSession } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async ({ username, password }) => {
    setLoading(true);
    setError("");
    try {
      const response = await loginService.add({ username, password });
      if (response && response.token) {
        initSession(response.token);
        router.push("/");
        return response;
      } else {
        setError(t("loginError") || "Usuario o contraseña incorrectos.");
        return null;
      }
    } catch (err) {
      setError(err?.message || t("loginError"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onLogin={handleLogin} loading={loading} error={error} />;
};

export default LoginPage;
