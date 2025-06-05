import React from "react";
import RegisterForm from "../components/RegisterForm";
import registerService from "../services/registerService";
import { useCrudManager } from "../../../shared/hooks/useCrudManager";
import { useTranslation } from "react-i18next";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [error, setError] = React.useState("");

  const handleError = (msg) => setError(msg);

  // Cambia la llamada para pasar fetchOnMount: false y así evitar el fetch inicial
  const { createItem, loading } = useCrudManager(
    registerService,
    handleError,
    t,
    { fetchOnMount: false }
  );

  return (
    <RegisterForm onRegister={createItem} loading={loading} error={error} />
  );
};

export default RegisterPage;
