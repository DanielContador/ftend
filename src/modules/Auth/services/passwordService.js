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

  changePassword = (password, token) => {
    // token puede venir por query param o body según tu backend
    return this.add("/change", { password, token });
  };
}

const passwordService = new PasswordService();
export default passwordService;
