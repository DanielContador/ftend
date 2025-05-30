import React from 'react';
import CourseLayout from '../../../../shared/layouts/CourseLayout';
import FileDownloadManager from '../../../../modules/FileDownloadManager/containers/FileDownloadManager';
import { useRouter } from 'next/router';

const ExportPage = () => {
    const router = useRouter();
    const { courseId } = router.query;

    if (!courseId) return null;

    return (
        <CourseLayout courseId={courseId} currentPage="FileDownloadManager">
            <FileDownloadManager courseId={courseId} />
        </CourseLayout>
    );
};

export default ExportPage;
