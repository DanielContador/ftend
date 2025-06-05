import React, { useState } from "react";
import { useAuth } from "../../../shared/utils/authProvider";
import loginService from "../services/loginService";
import { useRouter } from "next/router";
import Button1 from "../../../shared/components/Button1";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import styles from "./LoginForm.module.css";

const LoginForm = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { initSession } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginService.add({ username, password });
      initSession(response.token);
      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>{t("login")}</h2>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Usuario</label>
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
          <label className={styles.label}>{t("password")}</label>
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
            >
              👁️
            </span>
          </div>
        </div>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Button1
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
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
