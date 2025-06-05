import { BaseService } from "../../../shared/services/baseService";

const LOGIN_ENDPOINT = "user/login";

class LoginService extends BaseService {
  constructor() {
    super(LOGIN_ENDPOINT);
  }
}

const loginService = new LoginService();
export default loginService;
