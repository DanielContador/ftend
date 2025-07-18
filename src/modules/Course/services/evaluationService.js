import { BaseService } from "../../../shared/services/baseService";

const EVALUATION_ENDPOINT = "quizzes";

class EvaluationService extends BaseService {
  constructor(evaluationModuleUrl) {
    super(evaluationModuleUrl);
  }

  create = async (evaluationData) => {
    return await this.add(evaluationData);
  };
}

const evaluationService = new EvaluationService(EVALUATION_ENDPOINT);
export default evaluationService;
