import { Injectable } from '@angular/core';
import { IdGeneratorService } from '@fiap-tc-angular/domain/services/IdGeneratorService';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UuidIdGeneratorService implements IdGeneratorService {
  generate(): string {
    return uuidv4();
  }
}
