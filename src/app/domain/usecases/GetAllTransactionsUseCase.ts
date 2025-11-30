import { Observable } from 'rxjs';
import { Transaction } from '../entities/Transaction';
import { TransactionRepository } from '../repositories/TransactionRepository';

export class GetAllTransactionsUseCase {
  constructor(private transactionRepo: TransactionRepository) {}

  execute(): Observable<Transaction[]> {
    return this.transactionRepo.getAll();
  }
}
