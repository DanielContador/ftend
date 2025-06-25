import React from "react";
import styles from "./ActivityGenerationVideoGuionTab.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const ActivityGenerationVideoGuionTab = ({
  guionInput,
  setGuionInput,
  guionEdit,
  setGuionEdit,
}) => (
  <div className={styles.guionTabWrapper}>
    <div className={styles.guionCard}>
      <div className={styles.guionCardHeader}>Guión del video</div>
      <div className={styles.guionCardBody}>
        {guionEdit ? (
          <textarea
            className={styles.guionTextarea}
            value={guionInput}
            onChange={(e) => setGuionInput(e.target.value)}
            onBlur={() => setGuionEdit(false)}
            autoFocus
          />
        ) : (
          <div
            className={styles.guionTextDisplay}
            onClick={() => setGuionEdit(true)}
          >
            {guionInput}
            <FontAwesomeIcon
              icon={faPen}
              className={styles.penIcon}
              onClick={(e) => {
                e.stopPropagation();
                setGuionEdit(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
    <div className={styles.componentsCard}>
      <div className={styles.componentsCardHeader}>Componentes del video</div>
      <div className={styles.componentsCardBody}>
        <div className={styles.componentCol}>
          <label className={styles.componentLabel}>Tipo de video</label>
          <select className={styles.componentSelect} disabled>
            <option>Seleccionar</option>
          </select>
        </div>
        <div className={styles.componentCol}>
          <label className={styles.componentLabel}>Voz del avatar</label>
          <select className={styles.componentSelect} disabled>
            <option>Seleccionar</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

export default ActivityGenerationVideoGuionTab;
