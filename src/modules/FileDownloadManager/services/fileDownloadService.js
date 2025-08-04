import { BaseService } from "../../../shared/services/baseService";

const FILE_DOWNLOAD_ENDPOINT = "files";

class FileDownloadService extends BaseService {
  constructor(fileDownloadModuleUrl) {
    super(fileDownloadModuleUrl);
  }

  downloadFile = (activityId, filetype) => {
    const partialUrl = `/download/${filetype}/file`;
    return this.getById(activityId, partialUrl);
  };

  downloadCourseZip = (courseId) => {
    const partialUrl = `/descargar-zip`;
    return this.getById(courseId, partialUrl);
  };

  downloadCourseMBZ = (courseId) => {
    const partialUrl = `/descargar-mbz`;
    return this.getById(courseId, partialUrl);
  };
}

const fileDownloadService = new FileDownloadService(FILE_DOWNLOAD_ENDPOINT);

export default fileDownloadService;
