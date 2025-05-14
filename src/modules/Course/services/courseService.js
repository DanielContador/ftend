import { BaseService } from '../../Shared/services/baseService';

const COURSE_ENDPOINT = 'course';

class CourseService extends BaseService {
    constructor(courseModuleUrl) {
        super(courseModuleUrl);
    }

    generateStructure = (data, partialUrl) => {
        console.log('generateStructure');
        console.log(partialUrl);
        console.log(this);
        return this.add(data, partialUrl);
    }

    reGenerateStructure = (data, partialUrl) => this.add(data, partialUrl);

    getStructure = (id, partialUrl) => this.getById(id, partialUrl);

    updateTitle = (id, data, partialUrl) => this.update(id, data, partialUrl);

}

const courseService = new CourseService(COURSE_ENDPOINT);
export default courseService;