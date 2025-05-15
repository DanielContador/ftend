import { BaseService } from '../../Shared/services/baseService';

const COURSE_ENDPOINT = 'course';

class CourseService extends BaseService {
    constructor(courseModuleUrl) {
        super(courseModuleUrl);
    }
}

const courseService = new CourseService(COURSE_ENDPOINT);
export default courseService;