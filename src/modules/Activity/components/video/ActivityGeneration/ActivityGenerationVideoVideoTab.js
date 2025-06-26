import React from "react";
import styles from "./ActivityGenerationVideoVideoTab.module.css";
import LoadingSpinner from "../../../../../shared/components/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const ActivityGenerationVideoVideoTab = ({
  activityVideo,
  videoLoading,
  data,
  fileToken,
  onSaveContinue,
}) => (
  <div className={styles.videoTabWrapper}>
    <div className={styles.previewTitle}>Pre-visualización vídeo</div>
    {videoLoading ? (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    ) : activityVideo && activityVideo.videoUrl ? (
      <div className={styles.videoPreviewSection}>
        <video controls className={styles.videoPlayer}>
          <source
            src={`${process.env.NEXT_PUBLIC_API_URL}/v1/download/video/file/${data.id}?token=${fileToken}`}
            type="video/mp4"
          />
          Your browser does not support the video element.
        </video>
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/v1/download/video/file/${data.id}?token=${fileToken}`}
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

export default ActivityGenerationVideoVideoTab;
