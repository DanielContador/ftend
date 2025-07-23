import React, { useState, useEffect } from "react";
import styles from "./RegisterForm.module.css";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye as faEyeSolid,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { faEye as faEyeRegular } from "@fortawesome/free-regular-svg-icons";
import { useDispatch } from "react-redux";
import {
  showFloatingError,
  showFloatingSuccess,
} from "../../../shared/store/rootActions";

const RegisterForm = ({ onRegister, loading, error }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [news, setNews] = useState("yes");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();

  // Maneja errores globales
  React.useEffect(() => {
    if (error)
      dispatch(
        showFloatingError(error || "Error al registrar. Intenta nuevamente.")
      );
    // eslint-disable-next-line
  }, [error]);

  // Validación de campos
  const validate = () => {
    const errors = {};
    if (!fullName.trim()) {
      errors.fullName = "El nombre completo es obligatorio.";
    }
    if (!email) {
      errors.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Ingresa un correo electrónico válido.";
    }
    if (!password) {
      errors.password = "La contraseña es obligatoria.";
    } else {
      if (password.length < 8) {
        errors.password = "La contraseña debe tener al menos 8 caracteres.";
      } else if (!/[A-Z]/.test(password)) {
        errors.password = "La contraseña debe tener al menos una mayúscula.";
      } else if (!/[0-9]/.test(password)) {
        errors.password = "La contraseña debe tener al menos un número.";
      }
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Debes confirmar la contraseña.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden.";
    }
    if (!acceptTerms) {
      errors.acceptTerms = "Debes aceptar los términos y condiciones.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const [firstname, ...rest] = fullName.trim().split(" ");
    const lastname = rest.join(" ");
    const username = email.split("@")[0];

    try {
      const response = await onRegister({
        username,
        firstname,
        lastname,
        email,
        password,
      });

      if (response && response.status === 200) {
        dispatch(
          showFloatingSuccess("Registro exitoso. Ahora puedes iniciar sesión.")
        );
        router.push({
          pathname: "/welcome",
          query: { onlyLayout: "true" },
        });
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 400) {
        const errorData = err.response.data;
        if (
          Array.isArray(errorData) &&
          errorData.length > 0 &&
          errorData[0].code === "DuplicateUserName"
        ) {
          dispatch(
            showFloatingError(
              "Este nombre de usuario ya está registrado. Por favor, utiliza otro."
            )
          );
        } else {
          dispatch(
            showFloatingError("Error al registrar. Intenta nuevamente.")
          );
        }
      } else {
        dispatch(showFloatingError("Error al registrar. Intenta nuevamente."));
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* FloatingError y FloatingSuccess globales se muestran desde _app.js */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Registro de usuario</h2>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nombre completo</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className={styles.input}
          />
          {fieldErrors.fullName && (
            <div style={{ color: "#ff3b3b", fontSize: "0.95em" }}>
              {fieldErrors.fullName}
            </div>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          {fieldErrors.email && (
            <div style={{ color: "#ff3b3b", fontSize: "0.95em" }}>
              {fieldErrors.email}
            </div>
          )}
        </div>
        <div className={styles.inputGroupSmall}>
          <label className={styles.label}>
            Contraseña
            <span
              title="Mínimo 8 caracteres, 1 mayúscula, 1 número"
              className={styles.infoIcon}
              style={{ marginLeft: 6 }}
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
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeIcon}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEyeRegular} />
              ) : (
                <FontAwesomeIcon icon={faEyeSolid} />
              )}
            </span>
          </div>
          <div className={styles.passwordHint}>
            Mínimo 8 caracteres, 1 mayúscula, 1 número
          </div>
          {fieldErrors.password && (
            <div style={{ color: "#ff3b3b", fontSize: "0.95em" }}>
              {fieldErrors.password}
            </div>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Confirmar contraseña</label>
          <div className={styles.inputPasswordWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={styles.eyeIcon}
              style={{ cursor: "pointer" }}
            >
              {showConfirmPassword ? (
                <FontAwesomeIcon icon={faEyeRegular} />
              ) : (
                <FontAwesomeIcon icon={faEyeSolid} />
              )}
            </span>
          </div>
          {fieldErrors.confirmPassword && (
            <div style={{ color: "#ff3b3b", fontSize: "0.95em" }}>
              {fieldErrors.confirmPassword}
            </div>
          )}
        </div>
        <div className={styles.termsRow}>
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            required
            className={styles.checkbox}
          />
          <span>
            Acepto los{" "}
            <a href="#" className={styles.termsLink}>
              términos y condiciones
            </a>
          </span>
        </div>
        {fieldErrors.acceptTerms && (
          <div
            style={{
              color: "#ff3b3b",
              fontSize: "0.95em",
              marginBottom: 8,
            }}
          >
            {fieldErrors.acceptTerms}
          </div>
        )}
        <div className={styles.newsGroup}>
          <div className={styles.label}>
            ¿Deseas recibir noticias y actualizaciones?
          </div>
          <div className={styles.newsOptions}>
            <label
              className={`${styles.newsOption} ${
                news === "yes" ? styles.newsOptionActive : ""
              }`}
              style={{
                background: news === "yes" ? "#6C2BD7" : "#f3f3f3",
                color: news === "yes" ? "#fff" : "#222",
              }}
              onClick={() => setNews("yes")}
            >
              Sí
            </label>
            <label
              className={`${styles.newsOption} ${
                news === "no" ? styles.newsOptionActive : ""
              }`}
              style={{
                background: news === "no" ? "#6C2BD7" : "#f3f3f3",
                color: news === "no" ? "#fff" : "#222",
              }}
              onClick={() => setNews("no")}
            >
              No
            </label>
          </div>
        </div>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Registrando..." : "Crear cuenta"}
        </button>
        <div className={styles.loginLink}>
          <a
            href="#"
            className={styles.termsLink}
            onClick={(e) => {
              e.preventDefault();
              router.push("/login");
            }}
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </a>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
