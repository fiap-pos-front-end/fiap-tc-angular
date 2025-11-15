import { Transaction } from '../entities/Transaction';
import { ITransactionRepository } from '../repositories/ITransactionRepository';

export class CreateTransactionUseCase {
  constructor(private transactionRepo: ITransactionRepository) {}

  execute(data: CreateTransactionDTO): Transaction {
    // 1. Validate data

    // 2. Create entity using factory method

    // 3. Save using repository

    // 4. Return created entity

    return {};
  }
}
