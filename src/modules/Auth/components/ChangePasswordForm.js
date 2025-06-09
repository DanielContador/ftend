import React, { useState } from "react";
import styles from "./ChangePasswordForm.module.css";
import { useRouter } from "next/router";

const passwordRules = [
  "At least 8 characters",
  "At least one uppercase letter",
  "At least one lowercase letter",
  "At least one number",
];

const ChangePasswordForm = ({ onSubmit, loading, error }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

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
      await onSubmit?.(password);
    } catch (e) {
      setFieldError(e?.message || "Error al cambiar la contraseña.");
    } finally {
      setSubmitting(false);
    }
  };

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
          onClick={() => router.push("/login")}
        >
          Volver a home
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
