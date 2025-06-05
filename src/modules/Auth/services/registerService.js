import { BaseService } from "../../../shared/services/baseService";

const REGISTER_ENDPOINT = "user/register";

class RegisterService extends BaseService {
  constructor() {
    super(REGISTER_ENDPOINT);
  }
}

const registerService = new RegisterService();
export default registerService;
