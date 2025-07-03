import React, { useEffect, useState } from "react";
import styles from "./FloatingError.module.css";

const FloatingError = ({
  message,
  show,
  onClose,
  duration = 3000,
  top = 24,
  right = 24,
}) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let fadeTimer, removeTimer;
    if (show) {
      setFadeOut(false);
      fadeTimer = setTimeout(() => setFadeOut(true), duration - 700);
      removeTimer = setTimeout(() => {
        setFadeOut(false);
        if (onClose) onClose();
      }, duration);
    }
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div
      className={styles.floatingError}
      style={{
        top,
        right,
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.7s",
      }}
      onClick={onClose}
    >
      {message}
    </div>
  );
};

export default FloatingError;
