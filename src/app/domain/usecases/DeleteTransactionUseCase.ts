import { Observable } from 'rxjs';
import { TransactionRepository } from '../repositories/TransactionRepository';

export class DeleteTransactionUseCase {
  constructor(private transactionRepo: TransactionRepository) {}

  execute(transactionId: number): Observable<void> {
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }

    return this.transactionRepo.delete(transactionId);
  }
}
