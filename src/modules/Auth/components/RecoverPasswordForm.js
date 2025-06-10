import React, { useState } from "react";
import styles from "./RecoverPasswordForm.module.css";
import { useRouter } from "next/router";
import RecoverPasswordSendBrand from "./RecoverPasswordSendBrand";

const RecoverPasswordForm = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const validate = () => {
    if (!email) return "El email es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Ingresa un email válido.";
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
      await onSubmit(7);
      // await onSubmit?.(email);
      setSuccess(true);
    } catch (e) {
      setFieldError(e?.message || "Error al enviar el link.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <RecoverPasswordSendBrand onHomeClick={() => router.push("/login")} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.title}>
          Recuperación
          <br />
          contraseña
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={`${styles.input} ${fieldError ? styles.inputError : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="username"
            required
          />
          {fieldError && <div className={styles.fieldError}>{fieldError}</div>}
        </div>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading || submitting}
        >
          {loading || submitting
            ? "Enviando..."
            : "Enviar link de recuperación"}
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

export default RecoverPasswordForm;
