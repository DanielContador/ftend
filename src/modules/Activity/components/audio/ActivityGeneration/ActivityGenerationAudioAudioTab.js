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
}) => (
  <div className={styles.audioTabWrapper}>
    <div className={styles.previewTitle}>Pre-visualización audio</div>
    {audioLoading ? (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    ) : activityAudio && activityAudio.audioUrl ? (
      <div className={styles.audioPreviewSection}>
        <audio controls className={styles.audioPlayer}>
          <source
            src={`${process.env.NEXT_PUBLIC_API_URL}/v1/download/audio/file/${data.id}?token=${fileToken}`}
            type="audio/mp3"
          />
          Your browser does not support the audio element.
        </audio>
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/v1/download/audio/file/${data.id}?token=${fileToken}`}
          className={styles.downloadLink}
          download
        >
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

export default ActivityGenerationAudioAudioTab;
