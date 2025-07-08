import React from "react";
import styles from "./ActivityGenerationAudioAudioTab.module.css";
import LoadingSpinner from "../../../../../shared/components/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const ActivityGenerationAudioAudioTab = ({
  activityAudio,
  audioLoading,
  data,
  fileToken,
}) => {
  // Usa la lógica de AudioEditor: si hay filePath y fileToken, arma la url de descarga
  const audioUrl =
    activityAudio && activityAudio.filePath && fileToken
      ? `${process.env.NEXT_PUBLIC_API_URL}/v1/download/audio/file/${activityAudio.activityId}?token=${fileToken}`
      : "";

  return (
    <div className={styles.audioTabWrapper}>
      <div className={styles.previewTitle}>Pre-visualización audio</div>
      {audioLoading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      ) : audioUrl ? (
        <div className={styles.audioPreviewSection}>
          <audio controls className={styles.audioPlayer}>
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
          <a href={audioUrl} className={styles.downloadLink} download>
            <FontAwesomeIcon icon={faDownload} />
          </a>
        </div>
      ) : (
        <div className={styles.noData}>
          No hay datos para mostrar en esta pestaña.
        </div>
      )}
    </div>
  );
};

export default ActivityGenerationAudioAudioTab;
