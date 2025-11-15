import { InjectionToken } from '@angular/core';
import { IdGeneratorService } from '@fiap-tc-angular/domain/services/IdGeneratorService';

export const ID_GENERATOR_SERVICE_TOKEN = new InjectionToken<IdGeneratorService>('ID_GENERATOR_SERVICE_TOKEN');
