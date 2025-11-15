import { Provider } from '@angular/core';
import { TransactionRepository } from '@fiap-tc-angular/domain/repositories/TransactionRepository';
import { IdGeneratorService } from '@fiap-tc-angular/domain/services/IdGeneratorService';
import { CreateTransactionUseCase } from '@fiap-tc-angular/domain/usecases/CreateTransactionUseCase';
import { ID_GENERATOR_SERVICE_TOKEN } from '@fiap-tc-angular/infra/tokens/IdGeneratorService';
import { TRANSACTION_REPOSITORY_TOKEN } from '@fiap-tc-angular/infra/tokens/TransactionRepository';

export const TRANSACTION_USE_CASES_PROVIDERS: Provider[] = [
  {
    provide: CreateTransactionUseCase,
    useFactory: (idGeneratorService: IdGeneratorService, transactionRepository: TransactionRepository) => {
      return new CreateTransactionUseCase(idGeneratorService, transactionRepository);
    },
    deps: [ID_GENERATOR_SERVICE_TOKEN, TRANSACTION_REPOSITORY_TOKEN],
  },
];
