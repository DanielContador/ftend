import React, { useState } from "react";
import { useRouter } from "next/router";
import ResetPasswordForm from "../components/ResetPasswordForm";
import passwordService from "../services/passwordService";

const ChangePasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (password) => {
    setLoading(true);
    setError("");
    try {
      // El token puede venir por query param, ajusta según tu backend
      const token = router.query.token;
      const response = await passwordService.resetPassword(password, token);
      // Don't redirect here - let ResetPasswordForm handle the success state
      // The form will show ResetPasswordSuccessBrand and handle navigation
      return response; // Return successful response
    } catch (e) {
      console.error("ResetPasswordPage error:", e);
      setError(e.message || "Error al cambiar la contraseña.");
      // Re-throw the error so ResetPasswordForm can handle it properly
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResetPasswordForm
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
};

export default ChangePasswordPage;
