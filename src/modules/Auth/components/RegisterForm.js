import React, { useState } from "react";
import styles from "./RegisterForm.module.css";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const RegisterForm = ({ onRegister, loading, error }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [news, setNews] = useState("yes");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert("El nombre completo es obligatorio.");
      return;
    }
    setSuccess("");

    const [firstname, ...rest] = fullName.trim().split(" ");
    const lastname = rest.join(" ");
    const username = email.split("@")[0];

    try {
      await onRegister({
        username,
        firstname,
        lastname,
        email,
        password,
      });
      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      // ...puedes redirigir o limpiar el formulario aquí si lo deseas...
    } catch (err) {
      // El error ya es manejado por el hook y mostrado por la prop error
    }
  };

  return (
    <div className={styles.container}>
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
              <FontAwesomeIcon icon={faEye} />
            </span>
          </div>
          <div className={styles.passwordHint}>
            Mínimo 8 caracteres, 1 mayúscula, 1 número
          </div>
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
              <FontAwesomeIcon icon={faEye} />
            </span>
          </div>
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
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        {success && (
          <div style={{ color: "green", marginBottom: 8 }}>{success}</div>
        )}
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
