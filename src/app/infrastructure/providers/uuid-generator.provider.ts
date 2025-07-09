import { ID_GENERATOR_TOKEN } from '@fiap-tc-angular/core/application';
import { UuidGeneratorRepository } from '../repositories/uuid-generator.repository';

export const uuidGeneratorProvider = {
  provide: ID_GENERATOR_TOKEN,
  useClass: UuidGeneratorRepository,
};
