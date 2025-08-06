import { BaseService } from "../../../shared/services/baseService";
import axios from "axios";
import { getCookie } from "../../../shared/utils/session";

const FILE_DOWNLOAD_ENDPOINT = "files";

class FileDownloadService extends BaseService {
  constructor(fileDownloadModuleUrl) {
    super(fileDownloadModuleUrl);
  }

  // Binary file download method (GET) - needed because BaseService methods process JSON, not binary data
  #downloadBinaryFile = async (partialUrl) => {
    try {
      const jwt = this.#getAuthToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const config = {
        responseType: "arraybuffer", // Critical: this preserves binary data
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
      };
      const response = await axios.get(`${API_URL}/${this.baseUrl}${partialUrl}`, config);
      return response.data;
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  };

  // Binary file download method (POST) - for endpoints that require POST requests
  #downloadBinaryFilePost = async (partialUrl, data = {}) => {
    try {
      const jwt = this.#getAuthToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const config = {
        responseType: "arraybuffer", // Critical: this preserves binary data
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
      };
      const response = await axios.post(`${API_URL}/${this.baseUrl}${partialUrl}`, data, config);
      return response.data;
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  };

  // Get auth token - following BaseService pattern
  #getAuthToken = () => {
    return getCookie("authToken");
  };

  downloadCourseScorm = (courseId, data = {}) => {
    return this.#downloadBinaryFilePost(`/packageScorm/${courseId}`, data);
  };

  downloadCourseZip = (courseId) => {
    return this.#downloadBinaryFile(`/descargar-zip/${courseId}`);
  };

  downloadCourseMBZ = (courseId) => {
    return this.#downloadBinaryFile(`/descargar-mbz/${courseId}`);
  };
}

const fileDownloadService = new FileDownloadService(FILE_DOWNLOAD_ENDPOINT);

export default fileDownloadService;
