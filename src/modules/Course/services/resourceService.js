import { BaseService } from "../../../shared/services/baseService";

const Resource_ENDPOINT = "v1/resources";

class ResourceService extends BaseService {
  constructor(resourceModuleUrl) {
    super(resourceModuleUrl);
  }
}

const resourceService = new ResourceService(Resource_ENDPOINT);
export default resourceService;
