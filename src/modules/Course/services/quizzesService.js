import { BaseService } from "../../../shared/services/baseService";

const QUIZZES_ENDPOINT = "Quizzes";

class QuizzesService extends BaseService {
  constructor(quizzesModuleUrl) {
    super(quizzesModuleUrl);
  }

  getQuizzesByActivityId = async (activityId) => {
    return await this.getById(activityId, `/activity`);
  };
}

const quizzesService = new QuizzesService(QUIZZES_ENDPOINT);
export default quizzesService;
