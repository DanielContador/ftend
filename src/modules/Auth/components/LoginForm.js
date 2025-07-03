import React, { useState, useEffect } from "react";
import { useAuth } from "../../../shared/utils/authProvider";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import styles from "./LoginForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye as faEyeSolid } from "@fortawesome/free-solid-svg-icons";
import { faEye as faEyeRegular } from "@fortawesome/free-regular-svg-icons";
import FloatingError from "../../../shared/components/FloatingError";

const LoginForm = ({ onLogin, loading, error }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [remember, setRemember] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  const { initSession } = useAuth();

  const validate = () => {
    const errors = {};
    if (!username) {
      errors.username = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      errors.username = "Ingresa un email válido.";
    }
    if (!password) {
      errors.password = "La contraseña es obligatoria.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setShowError(false);
    setFieldErrors({});
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setSubmitting(true);
    try {
      const response = await onLogin({ username, password });
      if (response && response.token) {
        initSession(response.token);
        router.push("/");
      } else {
        setLocalError(t("loginError") || "Usuario o contraseña incorrectos.");
        setShowError(true);
      }
    } catch (err) {
      setLocalError(
        t("loginError") ||
          "Usuario o contraseña incorrectos. Intenta nuevamente."
      );
      setShowError(true);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (showError) {
      // El FloatingError se encarga de autocerrar, solo resetea el error cuando se cierra
      return () => {};
    }
  }, [showError]);

  return (
    <div className={styles.container}>
      <FloatingError
        message={
          localError ||
          error ||
          t("loginError") ||
          "Usuario o contraseña incorrectos. Intenta nuevamente."
        }
        show={showError && (localError || error)}
        onClose={() => setShowError(false)}
      />
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <h2 className={styles.title}>Inicio de sesión</h2>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={`${styles.input} ${
              fieldErrors.username ? styles.inputError : ""
            }`}
            autoComplete="username"
            placeholder="Enter your email"
          />
          {fieldErrors.username && (
            <div className={styles.fieldError}>{fieldErrors.username}</div>
          )}
        </div>
        <div className={styles.inputGroupSmall}>
          <label className={styles.label}>Contraseña</label>
          <div className={styles.inputPasswordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${styles.input} ${
                fieldErrors.password ? styles.inputError : ""
              }`}
              autoComplete="current-password"
              placeholder="Enter your password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeIcon}
              title="Pulsar para mostrar/ocultar contraseña"
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEyeRegular} />
              ) : (
                <FontAwesomeIcon icon={faEyeSolid} />
              )}
            </span>
          </div>
          {fieldErrors.password && (
            <div className={styles.fieldError}>{fieldErrors.password}</div>
          )}
          <div className={styles.passwordHintRow}>
            <FontAwesomeIcon icon={faEyeSolid} className={styles.infoIcon} />
            <span className={styles.passwordHintText}>
              Pulsa para mostrar/ocultar contraseña
            </span>
          </div>
        </div>
        <div className={styles.rememberRow}>
          <span className={styles.rememberLabel}>¿Recordar sesión?</span>
          <button
            type="button"
            className={`${styles.rememberBtn} ${
              remember ? styles.rememberBtnActive : ""
            }`}
            onClick={() => setRemember(true)}
          >
            Sí
          </button>
          <button
            type="button"
            className={`${styles.rememberBtn} ${
              !remember ? styles.rememberBtnActive : ""
            }`}
            onClick={() => setRemember(false)}
          >
            No
          </button>
        </div>
        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => router.push("/recover-password")}
            tabIndex={-1}
          >
            ¿Olvidaste tu contraseña?
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || submitting}
          >
            {loading || submitting ? "Cargando..." : "Iniciar sesión"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
