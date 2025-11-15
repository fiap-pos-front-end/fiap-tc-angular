import { Transaction as CreateTransactionData } from '@fiap-pos-front-end/fiap-tc-shared';
import { Observable } from 'rxjs';
import { Transaction } from '../entities/Transaction';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { IdGeneratorService } from '../services/IdGeneratorService';

export class CreateTransactionUseCase {
  constructor(
    private idGenerator: IdGeneratorService,
    private transactionRepo: TransactionRepository,
  ) {}

  // Nota: esse data foi uma boa forma de manter uma compatibilidade com a lib, mas pode ser refatorado
  //  se desejarmos. Além disso, manter ele ajudou a refatorar o app sem quebrar tudo.
  execute(data: CreateTransactionData): Observable<Transaction> {
    // 1. Validate data + Business rules
    if (!data.categoryId) throw new Error('Category ID is required');

    // 1.1. Generates ID
    const transactionId = this.idGenerator.generate();

    // 2. Create entity using factory method
    const transaction = Transaction.create(transactionId, data);

    // 3. Save using repository
    const savedTransaction = this.transactionRepo.create(transaction);

    // 4. Return created entity
    return savedTransaction;
  }
}
