import { BaseService } from "../../../shared/services/baseService";

const QUIZZES_GENERATOR_ENDPOINT = "QuizzesGenerator";

class QuizzesGeneratorService extends BaseService {
  constructor(quizzesGeneratorModuleUrl) {
    super(quizzesGeneratorModuleUrl);
  }

  generateQuiz = async (quizData) => {
    return await this.add(quizData, "/generate");
  };

  regenerateQuiz = async (quizData) => {
    return await this.add(quizData, "/regenerate");
  };
}

const quizzesGeneratorService = new QuizzesGeneratorService(
  QUIZZES_GENERATOR_ENDPOINT
);
export default quizzesGeneratorService;
