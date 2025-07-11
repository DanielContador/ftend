import React from "react";
import styles from "./ActivityGenerationPPTTab.module.css";

const ActivityGenerationPPTTab = ({ pptData, isLoading, fileToken, pptId }) => {
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <h2 className={styles.loadingTitle}>Generating...</h2>
        <p className={styles.loadingSubtitle}>
          Hang tight, we are getting things ready...
        </p>
        {/* El botón de cancelar requeriría una función para ser pasada como prop */}
        <button className={styles.cancelButton}>Cancel</button>
      </div>
    );
  }

  if (!pptData || !fileToken) {
    return (
      <div className={styles.placeholderContainer}>
        <p>
          Genera la presentación desde la pestaña de plantillas para verla aquí.
        </p>
      </div>
    );
  }
  const pptUrl = `https://view.officeapps.live.com/op/view.aspx?src=${process.env.NEXT_PUBLIC_API_URL}/v1/download/ppt/file/${pptId}?token=${fileToken}`;
  return (
    <div className={styles.pptViewer}>
      <iframe
        src={pptUrl}
        title="PPT Viewer"
        className={styles.pptIframe}
        frameBorder="0"
      />
    </div>
  );
};

export default ActivityGenerationPPTTab;
