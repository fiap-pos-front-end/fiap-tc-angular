import { TRANSACTION_REPOSITORY_TOKEN } from '@fiap-tc-angular/core/application';
import { LocalStorageTransactionRepository } from '../repositories/local-storage-transaction.repository';

export const localStorageTransactionProvider = {
  provide: TRANSACTION_REPOSITORY_TOKEN,
  useClass: LocalStorageTransactionRepository,
};
