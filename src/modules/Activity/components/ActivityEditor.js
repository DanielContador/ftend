import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import ActivityGenerationVideo from "./video/ActivityGeneration/ActivityGenerationVideo";
import ActivityGenerationAudio from "./audio/ActivityGeneration/ActivityGenerationAudio";
import ActivityGenerationDocument from "./document/ActivityGeneration/ActivityGenerationDocument";
import ActivityGenerationPPT from "./ppt/ActivityGeneration/ActivityGenerationPPT";
import ActivityGenerationScorm from "./scorm/ActivityGeneration/ActivityGenerationScorm";

const ActivityEditor = ({ courseId, handleError, onClose }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { id, format } = router.query;

  if (!id || !format || !courseId) return null;

  switch (format.toLowerCase()) {
    case "pdf":
    case "word":
    case "txt":
      return (
        <ActivityGenerationDocument
          onClose={onClose}
          activityId={id}
          format={format}
          courseId={courseId}
          handleError={handleError}
        />
      );
    case "audio":
      return (
        <ActivityGenerationAudio
          onClose={onClose}
          activityId={id}
          format={format}
          courseId={courseId}
          handleError={handleError}
        />
      );
    case "video":
      return (
        <ActivityGenerationVideo
          onClose={onClose}
          activityId={id}
          format={format}
          courseId={courseId}
          handleError={handleError}
        />
      );
    case "ppt":
      return (
        <ActivityGenerationPPT
          onClose={onClose}
          activityId={id}
          format={format}
          courseId={courseId}
          handleError={handleError}
        />
      );
    case "scorm":
    case "diapositiva_scorm":
      return (
        <ActivityGenerationScorm
          onClose={onClose}
          activityId={id}
          format={format}
          courseId={courseId}
          handleError={handleError}
        />
      );
    default:
      return <p>{t("invalidDataFormat")}</p>;
  }
};

export default ActivityEditor;
