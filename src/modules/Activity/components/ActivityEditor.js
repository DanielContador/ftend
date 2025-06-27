import React from "react";
import { useRouter } from "next/router";
import DocumentEditor from "./document/DocumentEditor";
import AudioEditor from "./audio/AudioEditor"; // Assuming you have an AudioEditor component
import VideoEditor from "./video/VideoEditor";
import PPTEditor from "./ppt/PPTEditor"; // Importing PPTEditor
import { useTranslation } from "react-i18next";
import ActivityGenerationVideo from "./video/ActivityGeneration/ActivityGenerationVideo";
import ActivityGenerationAudio from "./audio/ActivityGeneration/ActivityGenerationAudio";

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
        <DocumentEditor
          activityId={id}
          courseId={courseId}
          handleError={handleError}
        />
      );
    case "audio":
      return (
        // <AudioEditor
        //   activityId={id}
        //   courseId={courseId}
        //   handleError={handleError}
        // />
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
        // <VideoEditor
        //   activityId={id}
        //   courseId={courseId}
        //   handleError={handleError}
        // />
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
        <PPTEditor
          activityId={id}
          courseId={courseId}
          handleError={handleError}
        />
      );
    default:
      return <p>{t("invalidDataFormat")}</p>;
  }
};

export default ActivityEditor;
