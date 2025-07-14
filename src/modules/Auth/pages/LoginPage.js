import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import loginService from "../services/loginService";
import { useAuth } from "../../../shared/utils/authProvider";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { showFloatingError } from "../../../shared/store/rootActions";

const LoginPage = () => {
  const { initSession } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogin = async ({ username, password }) => {
    setLoading(true);
    try {
      const response = await loginService.add({ username, password });
      if (response && response.token) {
        // Asumiendo que el nombre de usuario es el email
        const user = { email: username }; 
        initSession(response.token, user);
        router.push("/");
      } else {
        // Si la respuesta no tiene token pero no hubo excepción, es un error de login
        dispatch(
          showFloatingError(
            t("loginError") || "Usuario o contraseña incorrectos."
          )
        );
      }
    } catch (err) {
      if (err.code === "ERR_NETWORK") {
        dispatch(
          showFloatingError(
            t("connectionError") ||
              "Error de conexión. Por favor, verifica tu red."
          )
        );
      } else if (err.response && err.response.status === 401) {
        dispatch(
          showFloatingError(
            t("loginError") || "Usuario o contraseña incorrectos."
          )
        );
      } else {
        dispatch(
          showFloatingError(
            t("genericError") || "Ha ocurrido un error inesperado."
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onLogin={handleLogin} loading={loading} />;
};

export default LoginPage;
