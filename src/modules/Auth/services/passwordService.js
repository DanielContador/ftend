import { BaseService } from "../../../shared/services/baseService";

const PASSWORD_ENDPOINT = "/api/auth/password";

class PasswordService extends BaseService {
  constructor() {
    super(PASSWORD_ENDPOINT);
  }

  requestRecoverPassword = (email) => {
    // Usa el método post heredado del BaseService
    return this.add("/recover", { email });
  };
}

const passwordService = new PasswordService();
export default passwordService;
