import { Injectable } from '@angular/core';
import { IIdGeneratorRepository } from '@fiap-tc-angular/core/domain';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UuidGeneratorRepository implements IIdGeneratorRepository {
  generate(): string {
    return uuidv4();
  }
}
