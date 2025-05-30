import { BaseService } from '../../../shared/services/baseService';

const CourseContentAI_ENDPOINT = 'CourseContentAI';

class CourseContentAIService extends BaseService {
    constructor(courseContentAIModuleUrl) {
        super(courseContentAIModuleUrl);
    }

    generateCourseStructure = (data, partialUrl) =>  this.add(data, partialUrl);

    reGenerateCourseStructure = (data, partialUrl) => this.add(data, partialUrl);

    getCourseStructure = (id, partialUrl) => this.getById(id, partialUrl);

}

const courseContentAIService = new CourseContentAIService(CourseContentAI_ENDPOINT);
export default courseContentAIService;