import { BaseService } from "../../../shared/services/baseService";

const USER_ENDPOINT = "user";

class UserService extends BaseService {
  constructor() {
    super(USER_ENDPOINT);
  }
}

const userService = new UserService();
export default userService;
