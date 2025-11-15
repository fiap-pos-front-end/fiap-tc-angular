import { Transaction } from '@fiap-tc-angular/domain/entities/Transaction';
import { TransactionType } from '@fiap-tc-angular/domain/enums/TransactionType';
import { TransactionDTO } from '../dtos/TransactionDTO';

export class TransactionMapper {
  static fromDtoToDomain(transaction: TransactionDTO): Transaction {
    return Transaction.reconstitute({
      id: String(transaction.id),
      amount: transaction.amount,
      date: new Date(transaction.date),
      type: transaction.type === 'Receita' ? TransactionType.RECEITA : TransactionType.DESPESA,
      categoryId: transaction.categoryId,
      userId: transaction.userId,
      attachments: transaction.attachments,
      category: transaction.category,
    });
  }
}
