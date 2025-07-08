import { Money } from './money.model';
import { TransactionType } from './transaction-type.enum';

export class Transaction {
  private constructor(
    private readonly _id: string,
    private readonly _type: TransactionType,
    private readonly _amount: Money,
    private readonly _date: Date,
    private readonly _category: string,
  ) {
    this.validateTransaction();
  }

  private validateTransaction(): void {
    if (!this._id) {
      throw new Error('Transaction must have an ID');
    }
    if (!this._category) {
      throw new Error('Transaction must have a category');
    }
    if (!this._date) {
      throw new Error('Transaction must have a date');
    }
  }

  // TODO: Atualizar esse método para gerar ID corretamente (com injeção de dependência) e uma categoria aleatória
  public static reset(): Transaction {
    return new Transaction('ID-FAKE', TransactionType.INCOME, Money.from(0), new Date(), 'CATEGORY-FAKE');
  }

  public static create(id: string, type: TransactionType, amount: number, date: Date, category: string): Transaction {
    return new Transaction(id, type, Money.from(amount), date, category);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get type(): TransactionType {
    return this._type;
  }

  get amount(): Money {
    return this._amount;
  }

  get date(): Date {
    return this._date;
  }

  get category(): string {
    return this._category;
  }

  // Domain methods
  public isExpense(): boolean {
    return this._type === TransactionType.EXPENSE;
  }

  public isIncome(): boolean {
    return this._type === TransactionType.INCOME;
  }

  public getSignedAmount(): Money {
    return this.isExpense() ? Money.from(-this._amount.getValue()) : this._amount;
  }

  // Para serialização
  public toJSON() {
    return {
      id: this._id,
      type: this._type,
      amount: this._amount.getValue(),
      date: this._date,
      category: this._category,
    };
  }
}
