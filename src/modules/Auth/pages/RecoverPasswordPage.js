import React, { useState } from "react";
import RecoverPasswordForm from "../components/RecoverPasswordForm";
import passwordService from "../services/passwordService";

const RecoverPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (email) => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await passwordService.requestRecoverPassword(email);
      setSuccessMsg(
        "Si el email existe, se ha enviado un link de recuperación."
      );
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
