import { Provider } from '@angular/core';
import { TransactionRepository } from '@fiap-tc-angular/domain/repositories/TransactionRepository';
import { IdGeneratorService } from '@fiap-tc-angular/domain/services/IdGeneratorService';
import { CreateTransactionUseCase } from '@fiap-tc-angular/domain/usecases/CreateTransactionUseCase';
import { DeleteTransactionUseCase } from '@fiap-tc-angular/domain/usecases/DeleteTransactionUseCase';
import { GetAllTransactionsUseCase } from '@fiap-tc-angular/domain/usecases/GetAllTransactionsUseCase';
import { UpdateTransactionUseCase } from '@fiap-tc-angular/domain/usecases/UpdateTransactionUseCase';
import { ID_GENERATOR_SERVICE_TOKEN } from '@fiap-tc-angular/infra/tokens/IdGeneratorService';
import { TRANSACTION_REPOSITORY_TOKEN } from '@fiap-tc-angular/infra/tokens/TransactionRepository';

export const TRANSACTION_USE_CASES_PROVIDERS: Provider[] = [
  {
    provide: GetAllTransactionsUseCase,
    useFactory: (transactionRepository: TransactionRepository) => {
      return new GetAllTransactionsUseCase(transactionRepository);
    },
    deps: [TRANSACTION_REPOSITORY_TOKEN],
  },
  {
    provide: CreateTransactionUseCase,
    useFactory: (idGeneratorService: IdGeneratorService, transactionRepository: TransactionRepository) => {
      return new CreateTransactionUseCase(idGeneratorService, transactionRepository);
    },
    deps: [ID_GENERATOR_SERVICE_TOKEN, TRANSACTION_REPOSITORY_TOKEN],
  },
  {
    provide: UpdateTransactionUseCase,
    useFactory: (transactionRepository: TransactionRepository) => {
      return new UpdateTransactionUseCase(transactionRepository);
    },
    deps: [TRANSACTION_REPOSITORY_TOKEN],
  },
  {
    provide: DeleteTransactionUseCase,
    useFactory: (transactionRepository: TransactionRepository) => {
      return new DeleteTransactionUseCase(transactionRepository);
    },
    deps: [TRANSACTION_REPOSITORY_TOKEN],
  },
];
