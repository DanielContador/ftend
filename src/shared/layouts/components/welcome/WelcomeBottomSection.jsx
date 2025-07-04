import React from "react";
import styles from "./WelcomeBottomSection.module.css";
import Image from "next/image";
import robotPurple from "../../../../../public/robotPurple.svg";
import thunder from "../../../../../public/thunder.svg";
import hat from "../../../../../public/hat.svg";
import brain from "../../../../../public/brain.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faListCheck,
  faEdit,
  faKeyboard,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const features = [
  {
    icon: thunder,
    title: "Creación Rápida",
    desc: "Genera recursos en minutos gracias a plantillas inteligentes.",
  },
  {
    icon: hat,
    title: "Fácil de Usar",
    desc: "Interfaz intuitiva, sin necesidad de conocimientos técnicos.",
  },
  {
    icon: brain,
    title: "Personalizable",
    desc: "Adapta los contenidos a tus necesidades y estilos.",
  },
];

const steps = [
  { icon: faKeyboard, label: "Ingresa el tema" },
  { icon: faListCheck, label: "Selecciona el tipo de recurso" },
  { icon: faEdit, label: "Revisa y ajusta" },
  { icon: faCheckCircle, label: "¡Listo para usar!" },
];

const WelcomeBottomSection = ({ queEsRef }) => {
  const router = useRouter();
  return (
    <div className={styles.bottomSection}>
      <section className={styles.whatIs} ref={queEsRef}>
        <div className={styles.iconBox}>
          <Image
            src={robotPurple}
            alt="¿Qué es MentorIA?"
            width={80}
            height={80}
          />
        </div>
        <div>
          <h2>¿Qué es el MentorIA?</h2>
          <p className={styles.description}>
            El MentorIA es una herramienta desarrollada por DL group que permite
            generar contenidos educativos de forma rápida, intuitiva y asistida
            por inteligencia artificial. Está pensado para docentes, diseñadores
            instruccionales y equipos de formación que buscan ahorrar tiempo sin
            perder calidad.
          </p>
        </div>
      </section>
      <section className={styles.features}>
        {features.map((f, i) => (
          <div className={styles.featureCard} key={i}>
            <div className={styles.featureIcon}>
              <Image src={f.icon} alt={f.title} width={48} height={48} />
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>
      <section className={styles.howItWorks}>
        <h2>¿Cómo funciona?</h2>
        <div className={styles.steps}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className={styles.step}>
                <div className={styles.stepIcon}>
                  <FontAwesomeIcon
                    icon={s.icon}
                    className={styles.ctaIcon}
                    style={{
                      fontSize: "1em",
                      width: "1em",
                      height: "1em",
                      minWidth: "1em",
                      flexShrink: 0,
                    }}
                  />
                </div>
                <span>{s.label}</span>
              </div>
              {i < steps.length - 1 && <span className={styles.dash}>—</span>}
            </React.Fragment>
          ))}
        </div>
      </section>
      <section className={styles.ctaSection}>
        <h2>¿Listo para probarlo?</h2>
        <p>Empieza a crear con inteligencia artificial hoy mismo.</p>
        <div className={styles.ctaButtonsRow}>
          <button
            onClick={() => router.push(`/register`)}
            className={styles.ctaButton}
          >
            Comenzar ahora
            <FontAwesomeIcon icon={faRocket} className={styles.ctaIcon} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default WelcomeBottomSection;
