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

const CourseListForm = ({ courses }) => {
  console.log("Courses:", courses);
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
          <div className={`${styles.actionCard} ${styles.iconLayerGroup}`}>
            <FontAwesomeIcon icon={faLayerGroup} />
          </div>
          <div>
            <p className={styles.number}>24</p>
            <p className={styles.cardSubInfo}>Recursos creados</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={`${styles.actionCard} ${styles.iconVideo}`}>
            <FontAwesomeIcon icon={faVideo} />
          </div>
          <div>
            <p className={styles.number}>Video</p>
            <p className={styles.cardSubInfo}>Mayor generado</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={`${styles.actionCard} ${styles.iconCoins}`}>
            <FontAwesomeIcon icon={faCoins} />
          </div>
          <div>
            <p className={styles.number}>55</p>
            <p className={styles.cardSubInfo}>Créditos restantes</p>
          </div>
        </div>
      </div>

      <div className={styles.resourcesWrapper}>
        <div className={styles.resources}>
          {courses.map((course) => (
            <div key={course.id} className={styles.resourceCard}>
              <div>
                <div className={styles.typeLabel}>
                  <div className={`${styles.actionCard} ${styles.iconVideo}`}>
                    <FontAwesomeIcon icon={faVideo} />
                  </div>
                  {course.resourceTypes}
                </div>
                <div className="mt-2">
                  <h3 className={styles.courseName}>{course.name}</h3>
                  <p className={styles.date}>
                    Creado en{" "}
                    {new Date(course.timeCreated).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <div className={styles.actions}>
                  <div className={`${styles.wordCard} ${styles.iconVideo}`}>
                    <p className={styles.textType}>{course.courseType}</p>
                  </div>
                  {course.courseType == null && (
                    <div className={`${styles.wordCard} ${styles.iconCoins}`}>
                      <p className={styles.textType}>Duplicado</p>
                    </div>
                  )}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseListForm;
