import { BaseService } from "../../../shared/services/baseService";

const COURSE_ENDPOINT = "course";

class CourseService extends BaseService {
  constructor(courseModuleUrl) {
    super(courseModuleUrl);
  }

  clone = async (courseId) => {
    const cloneCourseRequest = { CourseId: courseId };
    return await this.add(cloneCourseRequest, "/clone");
  };
}

const courseService = new CourseService(COURSE_ENDPOINT);
export default courseService;
