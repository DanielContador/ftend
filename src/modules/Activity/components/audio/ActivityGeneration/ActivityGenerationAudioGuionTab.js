import React, { useState } from "react";
import styles from "./ActivityGenerationAudioGuionTab.module.css";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";

const ActivityGenerationAudioGuionTab = ({
  guionInput,
  setGuionInput,
  guionEdit,
  setGuionEdit,
  voiceOptions,
  selectedVoice,
  setSelectedVoice,
  stability,
  setStability,
  similarity,
  setSimilarity,
  handleSaveScript,
}) => {
  const [tempGuion, setTempGuion] = useState(guionInput);

  const handleEditClick = () => {
    setTempGuion(guionInput);
    setGuionEdit(true);
  };
  const handleCancelEdit = () => {
    setTempGuion(guionInput);
    setGuionEdit(false);
  };
  const handleSaveEdit = () => {
    setGuionInput(tempGuion);
    setGuionEdit(false);
    if (typeof handleSaveScript === "function") {
      handleSaveScript(tempGuion);
    }
  };

  // Calcula el background dinámico para el slider
  const getSliderBackground = (value) =>
    `linear-gradient(to right, #7c3aed 0%, #7c3aed ${value}%, #ddd ${value}%, #ddd 100%)`;

  // Para aplicar la clase 'filled' y la variable CSS --percent
  const sliderProps = (value) => ({
    className: `${styles.slider} ${styles.filled}`,
    style: {
      "--percent": `${value}%`,
      background: getSliderBackground(value),
      cursor: "pointer",
    },
  });

  return (
    <div className={styles.guionTabWrapper}>
      <div className={styles.guionCard}>
        <div className={styles.guionCardHeader}>Guión del audio</div>
        <div className={styles.guionCardBody}>
          {guionEdit ? (
            <textarea
              className={styles.guionTextarea}
              value={tempGuion}
              onChange={(e) => setTempGuion(e.target.value)}
              style={{
                height: 200,
                minHeight: 200,
                maxHeight: 200,
                overflowY: "auto",
              }}
            />
          ) : (
            <div
              className={styles.guionTextDisplay}
              style={{
                height: 200,
                minHeight: 200,
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {guionInput}
            </div>
          )}
        </div>
        {!guionEdit ? (
          <button
            className={styles.editGuionBtn}
            onClick={handleEditClick}
            type="button"
          >
            <FontAwesomeIcon icon={faPen} style={{ marginRight: 6 }} />
            Editar
          </button>
        ) : (
          <div className={styles.editGuionActions}>
            <button
              className={styles.saveGuionBtn}
              onClick={handleSaveEdit}
              type="button"
            >
              <FontAwesomeIcon icon={faSave} style={{ marginRight: 4 }} />
              Guardar
            </button>
            <button
              className={styles.cancelGuionBtn}
              onClick={handleCancelEdit}
              type="button"
            >
              <FontAwesomeIcon icon={faXmark} style={{ marginRight: 4 }} />
              Cancelar
            </button>
          </div>
        )}
      </div>
      <div className={styles.componentsCard}>
        <div className={styles.componentsCardHeader}>Componentes del audio</div>
        <div className={styles.componentsCardBody}>
          <div className={styles.componentCol}>
            <label className={styles.componentLabel}>Buscar voces</label>
            <Select
              options={voiceOptions}
              classNamePrefix="audioVoiceSelect"
              className={styles.audioVoiceSelect__control}
              onChange={(option) =>
                setSelectedVoice(option ? option.value : null)
              }
              value={
                voiceOptions.find((opt) => opt.value === selectedVoice) || null
              }
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 99999 }),
              }}
              isClearable
              placeholder="Seleccionar"
            />
          </div>
          <div className={styles.componentCol}>
            <label className={styles.componentLabel}>Estabilidad</label>
            <input
              type="range"
              min="0"
              max="100"
              value={stability}
              onChange={(e) => setStability(Number(e.target.value))}
              {...sliderProps(stability)}
            />
            <span>{stability}%</span>
          </div>
          <div className={styles.componentCol}>
            <label className={styles.componentLabel}>Similitud</label>
            <input
              type="range"
              min="0"
              max="100"
              value={similarity}
              onChange={(e) => setSimilarity(Number(e.target.value))}
              {...sliderProps(similarity)}
            />
            <span>{similarity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityGenerationAudioGuionTab;
