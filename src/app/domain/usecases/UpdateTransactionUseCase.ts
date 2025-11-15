import { Transaction as CreateTransactionData } from '@fiap-pos-front-end/fiap-tc-shared';
import { Observable } from 'rxjs';
import { Transaction } from '../entities/Transaction';
import { TransactionRepository } from '../repositories/TransactionRepository';

export class UpdateTransactionUseCase {
  constructor(private transactionsRepo: TransactionRepository) {}

  execute(transactionId: number, transactionUpdate: CreateTransactionData): Observable<Transaction> {
    if (!transactionId) throw new Error('Transaction ID is required');

    const transaction = Transaction.create(String(transactionId), transactionUpdate);
    return this.transactionsRepo.update(transactionId, transaction);
  }
}
