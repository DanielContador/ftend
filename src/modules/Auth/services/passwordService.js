import { BaseService } from "../../../shared/services/baseService";

const PASSWORD_ENDPOINT = "User";

class PasswordService extends BaseService {
  constructor() {
    super(PASSWORD_ENDPOINT);
  }

  // requestRecoverPassword = (email) => {
  //   // Usa el método post heredado del BaseService
  //   return this.add({ email }, "/recovery-password");
  // };

  requestRecoverPassword = (id, partialUrl = "/recovery-password") =>
    this.getById(id, partialUrl);

  resetPassword = (password, token) => {
    let data = {
      token: token,
      newPassword: password,
    };
    // token puede venir por query param o body según tu backend
    return this.add(data, "/reset-password");
  };
}

const passwordService = new PasswordService();
export default passwordService;
