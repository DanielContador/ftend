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
      await passwordService.changePassword(password, token);
      // Redirige o muestra mensaje de éxito según tu flujo
      router.push("/login");
    } catch (e) {
      setError(e.message || "Error al cambiar la contraseña.");
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
