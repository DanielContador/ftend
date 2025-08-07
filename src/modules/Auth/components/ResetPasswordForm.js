import React, { useState } from "react";
import styles from "./ResetPasswordForm.module.css";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { showFloatingError } from "../../../shared/store/rootActions";
import ResetPasswordSuccessBrand from "./ResetPasswordSuccessBrand";

const passwordRules = [
  "At least 8 characters",
  "At least one uppercase letter",
  "At least one lowercase letter",
  "At least one number",
];

const ResetPasswordForm = ({ onSubmit, loading, error }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const validate = () => {
    if (!password || !confirm) return "Ambos campos son obligatorios.";
    if (password !== confirm) return "Las contraseñas no coinciden.";
    if (password.length < 8)
      return "La contraseña debe tener al menos 8 caracteres.";
    if (!/[A-Z]/.test(password)) return "Debe tener al menos una mayúscula.";
    if (!/[a-z]/.test(password)) return "Debe tener al menos una minúscula.";
    if (!/[0-9]/.test(password)) return "Debe tener al menos un número.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError("");
    const err = validate();
    if (err) {
      setFieldError(err);
      return;
    }
    setSubmitting(true);
    try {
      const response = await onSubmit?.(password);
      console.log("Success response:", response);
      // Success case - if we reach here without throwing, it's successful
      setSuccess(true);
    } catch (e) {
      // Handle all errors (including 500 status with backend error data)
      console.error("Reset password error:", e);

      // Check if it's a backend error response (axios error with response data)
      if (e.response && e.response.data) {
        const errorData = e.response.data;
        console.log("Backend error data:", errorData);
        
        if (errorData.errorMessage === "Invalid or expired token") {
          // Show floating error for expired token and redirect
          dispatch(
            showFloatingError(
              "Este enlace ha expirado. Por favor, solicita uno nuevo para continuar con el cambio de contraseña."
            )
          );
          // Redirect to welcome page after a short delay
          setTimeout(() => {
            router.push("/welcome");
          }, 2000);
          return; // Exit early to avoid setting field error
        } else {
          // Show other backend errors as field errors
          setFieldError(
            errorData.errorMessage || "Error al cambiar la contraseña."
          );
          return; // Exit early to avoid setting generic error
        }
      }
      
      // Network or other unexpected errors (only if no backend error data)
      setFieldError(
        e?.message || "Error de conexión. Por favor, intenta nuevamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <ResetPasswordSuccessBrand
          onHomeClick={() => router.push("/welcome")}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.title}>Nueva contraseña</div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nueva contraseña</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              autoComplete="new-password"
              required
            />
            <span
              className={styles.eye}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={0}
              role="button"
              aria-label="Mostrar contraseña"
            >
              {/* Puedes usar un icono SVG aquí */}
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="#BDBDBD"
                  strokeWidth="2"
                  d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="#BDBDBD"
                  strokeWidth="2"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Confirmar contraseña</label>
          <div className={styles.inputWrapper}>
            <input
              type={showConfirm ? "text" : "password"}
              className={styles.input}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              required
            />
            <span
              className={styles.eye}
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={0}
              role="button"
              aria-label="Mostrar contraseña"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="#BDBDBD"
                  strokeWidth="2"
                  d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="#BDBDBD"
                  strokeWidth="2"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className={styles.rules}>
          {passwordRules.map((rule) => (
            <div key={rule}>{rule}</div>
          ))}
        </div>
        {fieldError && <div className={styles.fieldError}>{fieldError}</div>}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading || submitting}
        >
          {loading || submitting ? "Cambiando..." : "Cambiar contraseña"}
        </button>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={() => router.push("/welcome")}
        >
          Volver a home
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
