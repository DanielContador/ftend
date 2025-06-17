import React from "react";
import styles from "./CourseListForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faEye,
  faTrash,
  faCopy,
  faEdit,
  faCoins,
  faLayerGroup,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const CourseListForm = () => {
  const resources = [
    {
      type: "Video",
      title: "Bases de la Ley Karin",
      date: "mayo 15",
      tags: ["Video"],
    },
    {
      type: "Curso",
      title: "Bases de la Ley Karin",
      date: "mayo 15",
      tags: ["Curso", "Duplicado"],
    },
    {
      type: "Video",
      title: "Bases de la Ley Karin",
      date: "mayo 15",
      tags: ["Video"],
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recursos Generados</h1>
        <button className={styles.createBtn}>
          <FontAwesomeIcon icon={faPlus} /> Crear recurso
        </button>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Buscar recurso..."
          className={styles.searchInput}
        />
        <button className={styles.orderBtn}>Orden</button>
      </div>

      <div className={styles.stats}>
        <div className={styles.card}>
          <FontAwesomeIcon icon={faLayerGroup} />
          <div>
            <p className={styles.number}>24</p>
            <p>Recursos creados</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={`${styles.iconWrapper}`}>
            <FontAwesomeIcon icon={faVideo} />
          </div>
          <div>
            <p className={styles.number}>Video</p>
            <p>Mayor generado</p>
          </div>
        </div>
        <div className={styles.card}>
          <FontAwesomeIcon icon={faCoins} />
          <div>
            <p className={styles.number}>55</p>
            <p>Créditos restantes</p>
          </div>
        </div>
      </div>

      <div className={styles.resources}>
        {resources.map((res, idx) => (
          <div key={idx} className={styles.resourceCard}>
            <div className={styles.typeLabel}>
              <FontAwesomeIcon icon={faVideo} /> {res.type}
            </div>
            <h3>{res.title}</h3>
            <p className={styles.date}>Creado en {res.date}</p>
            <div className={styles.tags}>
              {res.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`${styles.tag} ${styles[`tag${tag}`]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.actions}>
              <div className={styles.actionCard}>
                <FontAwesomeIcon icon={faEdit} />
              </div>
              <div className={styles.actionCard}>
                <FontAwesomeIcon icon={faEye} />
              </div>
              <div className={styles.actionCard}>
                <FontAwesomeIcon icon={faTrash} />
              </div>
              <div className={styles.actionCard}>
                <FontAwesomeIcon icon={faCopy} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseListForm;
