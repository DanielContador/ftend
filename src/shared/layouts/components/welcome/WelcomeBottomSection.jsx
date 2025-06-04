import React from "react";
import styles from "./WelcomeBottomSection.module.css";
import Image from "next/image";
import robotPurple from "../../../../../public/robotPurple.png";
import thunder from "../../../../../public/thunder.png";
import hat from "../../../../../public/hat.png";
import brain from "../../../../../public/brain.png";
import check from "../../../../../public/check.png";
import listcheck from "../../../../../public/checklist.png";
import edit from "../../../../../public/edit.png";
import keyboard from "../../../../../public/keyboard.png";
import rocket from "../../../../../public/rocket.png";

const features = [
  {
    icon: thunder,
    title: "Crea en minutos",
    desc: "Genera recursos educativos rápidamente con plantillas inteligentes y procesos guiados.",
  },
  {
    icon: hat,
    title: "Sin complicaciones",
    desc: "Interfaz simple y amigable, pensada para docentes y equipos de formación.",
  },
  {
    icon: brain,
    title: "Personaliza a tu medida",
    desc: "Adapta los contenidos y recursos según tus necesidades y estilo.",
  },
];

const steps = [
  { icon: check, label: "Ingresa el tema" },
  { icon: listcheck, label: "Selecciona el tipo de recurso" },
  { icon: edit, label: "Revisa y ajusta" },
  { icon: keyboard, label: "¡Listo para usar!" },
];

const WelcomeBottomSection = () => (
  <div className={styles.bottomSection}>
    <section className={styles.whatIs}>
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
          MentorIA es una herramienta desarrollada por DL Group que te ayuda a
          crear materiales didácticos de forma rápida, intuitiva y asistida por
          inteligencia artificial. Ideal para docentes, diseñadores
          instruccionales y equipos de formación que buscan ahorrar tiempo y
          mantener la calidad.
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
                <Image src={s.icon} alt={s.label} width={48} height={48} />
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
        <button className={styles.ctaButton}>
          Comenzar ahora
          <Image
            src={rocket}
            alt="Rocket"
            width={22}
            height={22}
            className={styles.ctaIcon}
          />
        </button>
      </div>
    </section>
  </div>
);

export default WelcomeBottomSection;
