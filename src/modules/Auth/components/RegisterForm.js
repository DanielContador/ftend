import React, { useState, useEffect } from "react";
import styles from "./RegisterForm.module.css";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import {
  showFloatingError,
  showFloatingSuccess,
} from "../../../shared/store/rootActions";
import registro from "../../../../public/registro.svg";
import Image from "next/image";
const RegisterForm = ({ onRegister, loading, error }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [receiveNews, setReceiveNews] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

      if (response && response.success) {
        dispatch(
          showFloatingSuccess("Registro exitoso. Ahora puedes iniciar sesión.")
        );
        router.push({
          pathname: "/welcome",
          query: { onlyLayout: "true" },
        });
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        // Nuevo manejo de errores para USEREXIST
        if (errorData.code === "USEREXIST") {
          dispatch(showFloatingError(errorData.errorMessage));
        } else if (
          // Mantenemos la lógica anterior por si acaso
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
            showFloatingError(
              errorData.errorMessage ||
                "Error al registrar. Intenta nuevamente."
            )
          );
        }
      } else {
        // Error genérico si no hay respuesta del servidor
        dispatch(
          showFloatingError("Error de conexión. Por favor, intenta nuevamente.")
        );
      }
    }
  };

  return (
    <div className={styles.cardContainer}>
      {/* FloatingError y FloatingSuccess globales se muestran desde _app.js */}
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.contentUp}>
          <div className={styles.titleSection}>
            

                        <Image
                          src={registro}
                          alt="registro icon"
                          width={35}
                          height={35}
                        />
            <h2 className={styles.title}>Registro</h2>
          </div>

          <div className={styles.inputsSection}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nombre completo*</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className={`${styles.input} ${
                  fieldErrors.fullName ? styles.inputError : ""
                }`}
                placeholder="Ingresa nombre completo"
              />
              {fieldErrors.fullName && (
                <div className={styles.fieldError}>{fieldErrors.fullName}</div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Correo electrónico*</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${styles.input} ${
                  fieldErrors.email ? styles.inputError : ""
                }`}
                placeholder="Ingresa usuario o correo"
              />
              {fieldErrors.email && (
                <div className={styles.fieldError}>{fieldErrors.email}</div>
              )}
            </div>

            <div className={styles.passwordSection}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Contraseña*</label>
                <div className={styles.inputPasswordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`${styles.input} ${
                      fieldErrors.password ? styles.inputError : ""
                    }`}
                    placeholder="Ingresa contraseña"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.eyeIcon}
                    title="Mostrar/ocultar contraseña"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </span>
                </div>
                {fieldErrors.password && (
                  <div className={styles.fieldError}>{fieldErrors.password}</div>
                )}
              </div>
              <p className={styles.passwordHint}>
                Mínimo 8 caracteres, 1 mayúscula, 1 número.
              </p>
            </div>

            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className={styles.checkbox}
                />
                <label htmlFor="acceptTerms" className={styles.checkboxLabel}>
                  Acepto los{" "}
                  <a href="#" className={styles.termsLink}>
                    Términos y condiciones
                  </a>
                </label>
              </div>
              {fieldErrors.acceptTerms && (
                <div className={styles.fieldError}>{fieldErrors.acceptTerms}</div>
              )}
            </div>

            <div className={styles.checkboxRow}>
              <input
                type="checkbox"
                id="receiveNews"
                checked={receiveNews}
                onChange={(e) => setReceiveNews(e.target.checked)}
                className={styles.checkbox}
              />
              <label htmlFor="receiveNews" className={styles.checkboxLabel}>
                Quiero recibir novedades y ofertas
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Registrando..." : "Registrarme"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
