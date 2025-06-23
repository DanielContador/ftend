import { getCookie } from "../../../shared/utils/session";
import { rDelete, rPut } from "../../../shared/services/apiService"; // Importing the apiService

export const deleteTopic = async (endpoint, id) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rDelete(`${endpoint}/${id}`, jwt);
};

export const deleteActivity = async (endpoint, id) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rDelete(`${endpoint}/${id}`, jwt);
};

export const updateModuleTitle = async (endpoint, id, moduleData) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPut(`${endpoint}/${id}`, moduleData, jwt);
};
export const updateActivityTitle = async (endpoint, id, activityData) => {
  const jwt = getCookie("authToken"); // Retrieve the authToken
  return await rPut(`${endpoint}/${id}`, activityData, jwt);
};

//Este codigo necesita ser refactorizado para que sea mas generico y reutilizable

// const COURSE_STRUCTURE_ENDPOINT = "activity";

// class CourseStructureService extends BaseService {
//   constructor(courseStructureModuleUrl) {
//     super(courseStructureModuleUrl);
//   }
// }

// const courseStructureService = new CourseService(COURSE_STRUCTURE_ENDPOINT);
// export default courseStructureService;
