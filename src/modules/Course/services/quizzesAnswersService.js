import { BaseService } from "../../../shared/services/baseService";

const QUIZ_ANSWERS_ENDPOINT = "QuizAnswers";

class QuizzesAnswersService extends BaseService {
  constructor(quizAnswersModuleUrl) {
    super(quizAnswersModuleUrl);
  }

  addQuizAnswers = async (quizAnswerData) => {
    return await this.add(quizAnswerData);
  };
}

const quizzesAnswersService = new QuizzesAnswersService(QUIZ_ANSWERS_ENDPOINT);
export default quizzesAnswersService;
