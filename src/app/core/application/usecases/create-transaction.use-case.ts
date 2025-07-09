import {
  IIdGeneratorRepository,
  ITransactionRepository,
  Transaction,
  TransactionType,
} from '@fiap-tc-angular/core/domain';
import { Observable } from 'rxjs';

export class CreateTransactionUseCase {
  constructor(
    private readonly repository: ITransactionRepository,
    private readonly idGenerator: IIdGeneratorRepository,
  ) {}

  execute(input: { category: string; amount: number; date: Date; type: TransactionType }): Observable<Transaction> {
    const transaction = Transaction.create(
      this.idGenerator.generate(),
      input.type,
      input.amount,
      input.date,
      input.category,
    );

    return this.repository.create(transaction);
  }
}
