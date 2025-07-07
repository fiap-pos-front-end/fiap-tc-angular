import { TRANSACTION_REPOSITORY } from '@fiap-tc-angular/core/application';
import { InMemoryTransactionRepository } from '../repositories/in-memory-transaction.repository';

export const inMemoryTransactionProvider = {
  provide: TRANSACTION_REPOSITORY,
  useClass: InMemoryTransactionRepository,
};
