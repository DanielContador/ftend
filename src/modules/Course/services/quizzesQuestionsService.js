import { BaseService } from "../../../shared/services/baseService";

const QUIZ_QUESTIONS_ENDPOINT = "QuizQuestions";

class QuizzesQuestionsService extends BaseService {
  constructor(quizQuestionsModuleUrl) {
    super(quizQuestionsModuleUrl);
  }

  addQuizQuestions = async (quizQuestionData) => {
    return await this.add(quizQuestionData);
  };

  updateQuizQuestions = async (id, quizQuestionData) => {
    return await this.update(id, quizQuestionData);
  };

  deleteQuizQuestions = async (id) => {
    return await this.delete(id);
  };
}

const quizzesQuestionsService = new QuizzesQuestionsService(QUIZ_QUESTIONS_ENDPOINT);
export default quizzesQuestionsService;
