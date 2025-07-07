export class Money {
  private constructor(private readonly amount: number) {
    this.validateAmount(amount);
  }

  private validateAmount(amount: number): void {
    if (isNaN(amount)) {
      throw new Error('Amount must be a valid number');
    }

    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
  }

  public static from(amount: number): Money {
    return new Money(amount);
  }

  public add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  public subtract(other: Money): Money {
    const result = this.amount - other.amount;
    return new Money(result >= 0 ? result : 0);
  }

  public getValue(): number {
    return this.amount;
  }

  public toString(): string {
    return this.amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
