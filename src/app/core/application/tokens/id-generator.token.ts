import { InjectionToken } from '@angular/core';
import { IIdGeneratorRepository } from '@fiap-tc-angular/core/domain';

export const ID_GENERATOR_TOKEN = new InjectionToken<IIdGeneratorRepository>('ID_GENERATOR_TOKEN');
