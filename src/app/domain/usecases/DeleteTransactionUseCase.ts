import { TransactionRepository } from '../repositories/TransactionRepository';

export class DeleteTransactionUseCase {
  constructor(private transactionRepo: TransactionRepository) {}

  execute(transactionId: number) {
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }

    return this.transactionRepo.delete(transactionId);
  }
}
