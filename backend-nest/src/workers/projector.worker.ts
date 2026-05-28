import { ReadModelsService } from '../modules/read-models/read-models.service';

export async function runProjectorWorker(readModelsService: ReadModelsService) {
  return readModelsService.projectFinancialEvents(1000);
}
