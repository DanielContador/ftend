import React, { useEffect, useState } from "react";
import styles from "./ActivityGenerationPPTPlantillasTab.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePowerpoint } from "@fortawesome/free-solid-svg-icons";
import { getPPTTemplates } from "../../../services/activityService";

const ActivityGenerationPPTPlantillasTab = ({
  selectedTemplate,
  setSelectedTemplate,
  loading,
}) => {
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  useEffect(() => {
    setLoadingTemplates(true);
    getPPTTemplates()
      .then((response) => {
        setTemplates(response.data.result || []);
      })
      .catch(() => setTemplates([]))
      .finally(() => setLoadingTemplates(false));
  }, []);

  return (
    <div className={styles.plantillasTabWrapper}>
      <div className={styles.plantillasHeader}>
        <FontAwesomeIcon
          icon={faFilePowerpoint}
          className={styles.pptCustomIcon}
        />
        <div>
          <div className={styles.title}>Crear una presentación</div>
          <div className={styles.subtitle}>
            Esto creará una presentación de PowerPoint basada en el tema que
            elijas.
          </div>
        </div>
      </div>
      <div className={styles.tabsRow}>
        <button className={styles.tabActive}>Plantillas</button>
      </div>
      <div className={styles.selectLabel}>Selecciona una plantilla</div>
      <div className={styles.templatesGrid}>
        {loadingTemplates ? (
          <div className={styles.loaderContainer}>
            <span className={styles.loader}></span>
          </div>
        ) : (
          templates.map((tpl) => (
            <button
              key={tpl.name}
              type="button"
              className={`${styles.templateCard} ${
                selectedTemplate && selectedTemplate.name === tpl.name
                  ? styles.selected
                  : ""
              }`}
              onClick={() => setSelectedTemplate(tpl)}
              tabIndex={0}
            >
              <div className={styles.templateImageBox}>
                <img
                  src={tpl.images?.cover}
                  alt={tpl.name}
                  className={styles.templateImage}
                />
              </div>
              <div className={styles.templateName}>{tpl.name}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityGenerationPPTPlantillasTab;
