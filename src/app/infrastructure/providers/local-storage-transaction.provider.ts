import { TRANSACTION_REPOSITORY } from '@fiap-tc-angular/core/application';
import { LocalStorageTransactionRepository } from '../repositories/local-storage-transaction.repository';

export const localStorageTransactionProvider = {
  provide: TRANSACTION_REPOSITORY,
  useClass: LocalStorageTransactionRepository,
};
