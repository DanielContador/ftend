import React, { useState } from "react";
import { useAuth } from "../../../shared/utils/authProvider";
import { useRouter } from "next/router";
import Button1 from "../../../shared/components/Button1";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import styles from "./LoginForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const LoginForm = ({ onLogin, loading, error }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { initSession } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSubmitting(true);
    try {
      const response = await onLogin({ username, password });
      if (response && response.token) {
        initSession(response.token);
        router.push("/");
      } else {
        setLocalError(t("loginError") || "Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      setLocalError(err?.message || t("loginError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>{t("login")}</h2>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Usuario
            <span
              title="Ingresa tu usuario"
              className={styles.infoIcon}
              style={{
                marginLeft: 6,
                color: "#888",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon
                icon={faCircleInfo}
                style={{ width: "1rem", color: "#888" }}
              />
            </span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
            autoComplete="username"
          />
        </div>
        <div className={styles.inputGroupSmall}>
          <label className={styles.label}>
            {t("password")}
            <span
              title="Ingresa tu contraseña"
              className={styles.infoIcon}
              style={{
                marginLeft: 6,
                color: "#888",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon
                icon={faCircleInfo}
                style={{ width: "1rem", color: "#888" }}
              />
            </span>
          </label>
          <div className={styles.inputPasswordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              autoComplete="current-password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeIcon}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faEye} />
            </span>
          </div>
        </div>
        {(error || localError) && (
          <div style={{ color: "red", marginBottom: 8 }}>
            {error || localError}
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {loading || submitting ? (
            <LoadingSpinner />
          ) : (
            <Button1
              type="submit"
              className={styles.submitBtn}
              disabled={loading || submitting}
            >
              {t("login")}
            </Button1>
          )}
        </div>
        <div className={styles.loginLink}>
          <a
            href="#"
            className={styles.termsLink}
            onClick={(e) => {
              e.preventDefault();
              router.push("/register");
            }}
          >
            {t("no_account")} {t("register")}
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
