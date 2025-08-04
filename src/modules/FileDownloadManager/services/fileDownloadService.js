import { BaseService } from "../../../shared/services/baseService";
import axios from 'axios';
import { getCookie } from '../../../shared/utils/session';

const FILE_DOWNLOAD_ENDPOINT = "files";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

class FileDownloadService extends BaseService {
  constructor(fileDownloadModuleUrl) {
    super(fileDownloadModuleUrl);
  }

  #getAuthToken = () => {
    return getCookie('authToken');
  };

  #downloadBinaryFile = async (endpoint) => {
    try {
      const jwt = this.#getAuthToken();
      const config = {
        responseType: 'arraybuffer',
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
      };
      const response = await axios.get(`${API_URL}/${endpoint}`, config);
      return response.data;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  };

  downloadFile = (activityId, filetype) => {
    const endpoint = `${this.baseUrl}/download/${filetype}/file/${activityId}`;
    return this.#downloadBinaryFile(endpoint);
  };

  downloadCourseZip = (courseId) => {
    const endpoint = `${this.baseUrl}/descargar-zip/${courseId}`;
    return this.#downloadBinaryFile(endpoint);
  };

  downloadCourseMBZ = (courseId) => {
    const endpoint = `${this.baseUrl}/descargar-mbz/${courseId}`;
    return this.#downloadBinaryFile(endpoint);
  };
}

const fileDownloadService = new FileDownloadService(FILE_DOWNLOAD_ENDPOINT);

export default fileDownloadService;
