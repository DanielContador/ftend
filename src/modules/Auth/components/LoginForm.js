import React, { useState } from "react";
import { useAuth } from "../../../shared/utils/authProvider";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import styles from "./LoginForm.module.css";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { showFloatingError } from "../../../shared/store/rootActions";
import login from "../../../../public/login.png";
import eye from "../../../../public/eye.png";

const LoginForm = ({ onLogin, loading, error }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [remember, setRemember] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const router = useRouter();
  const { initSession } = useAuth();
  const dispatch = useDispatch();

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
    setFieldErrors({});
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setSubmitting(true);
    await onLogin({ username, password });
    setSubmitting(false);
  };

  return (
    <div className={styles.cardContainer}>
      {/* FloatingError global se muestra desde _app.js */}
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.contentUp}>
          <div className={styles.titleSection}>
                    <Image
                      src={login}
                      alt="login"
                      width={27}
                      height={27}
                      style={{ objectFit: "contain" }}
                    />
            <h2 className={styles.title}>Inicio de sesión</h2>
          </div>

          <div className={styles.inputsSection}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Correo electrónico</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`${styles.input} ${
                  fieldErrors.username ? styles.inputError : ""
                }`}
                autoComplete="username"
                placeholder="Ingresa usuario o correo"
              />
              {fieldErrors.username && (
                <div className={styles.fieldError}>{fieldErrors.username}</div>
              )}
            </div>

            <div className={styles.inputGroup}>
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
                  placeholder="Ingresa contraseña"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeIcon}
                  title="Mostrar/ocultar contraseña"
                >
                    <Image src={eye} alt="eye icon" width={23} height={15} />
                </span>
              </div>
              {fieldErrors.password && (
                <div className={styles.fieldError}>{fieldErrors.password}</div>
              )}
            </div>

            <div className={styles.checkboxRow}>
              <input
                type="checkbox"
                id="rememberSession"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className={styles.checkbox}
              />
              <label htmlFor="rememberSession" className={styles.checkboxLabel}>
                Mantener sesión iniciada
              </label>
            </div>
          </div>
        </div>

        <div className={styles.buttonsSection}>
          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={loading || submitting}
          >
            {loading || submitting ? "Cargando..." : "Iniciar Sesión"}
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => router.push("/register")}
          >
            Crear cuenta
          </button>
          <div className={styles.forgotLink}>
            <a href="/recover-password">¿Olvidaste tu contraseña?</a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
