import React from "react";
import FileDownloadManager from "../../../../modules/FileDownloadManager/components/FileDownloadManager";
import { useRouter } from "next/router";
import ManagementLayout from "../../../../shared/layouts/managementlayout/ManagementLayout";
import SaveContinueButton from "../../../../shared/layouts/components/management/SaveContinueButton";

const ExportPage = () => {
  const router = useRouter();
  const { courseId } = router.query;

  if (!courseId) return null;

  return (
    <ManagementLayout menuButtons={[SaveContinueButton]}>
      <FileDownloadManager courseId={courseId} />
    </ManagementLayout>
  );
};

export default ExportPage;
