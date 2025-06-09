import React, { useState } from "react";
import RecoverPasswordForm from "../components/RecoverPasswordForm";
import passwordService from "../services/passwordService";

const RecoverPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (email) => {
    setLoading(true);
    setError("");
    try {
      await passwordService.requestRecoverPassword(email);
    } catch (e) {
      setError(e.message || "Error al enviar el link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecoverPasswordForm
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
};

export default RecoverPasswordPage;
