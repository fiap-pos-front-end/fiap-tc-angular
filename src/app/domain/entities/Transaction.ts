import { Category } from '@fiap-pos-front-end/fiap-tc-shared';
import { TransactionType } from '../enums/TransactionType';

export class Transaction {
  private constructor(
    public readonly id: string,
    public readonly amount: string,
    public readonly date: Date,
    public readonly type: TransactionType,
    public readonly categoryId: number,
    public readonly userId?: number,
    public readonly attachments?: string,
    public readonly category?: Category, // TODO: [Clean Arch] Para melhorar ainda mais, poderia ser tratada por um UseCase ou ViewModel
  ) {}

  // Factory method for creating NEW transactions
  static create(
    id: string,
    data: {
      amount: string;
      date: Date;
      type: TransactionType;
      categoryId: number;
      userId?: number;
      attachments?: string;
      category?: Category;
    },
  ): Transaction {
    // DOMAIN VALIDATION (business rules)
    if (Number(data.amount) <= 0) {
      throw new Error('Transaction amount must be greater than zero');
    }

    // Create new entity
    return new Transaction(
      id,
      data.amount,
      data.date,
      data.type,
      data.categoryId,
      data.userId,
      data.attachments,
      data.category,
    );
  }

  static reconstitute(data: {
    id: string;
    amount: string;
    date: Date;
    type: TransactionType;
    categoryId: number;
    userId?: number;
    attachments?: string;
    category?: Category;
  }): Transaction {
    return new Transaction(
      data.id,
      data.amount,
      data.date,
      data.type,
      data.categoryId,
      data.userId,
      data.attachments,
      data.category,
    );
  }

  // Domain method: calculate impact on balance
  getBalanceImpact(): number {
    return this.type === TransactionType.RECEITA ? Number(this.amount) : -Number(this.amount);
  }
}
