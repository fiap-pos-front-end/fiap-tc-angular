import { Injectable } from '@angular/core';
import { ITransactionRepository, Transaction } from '@fiap-tc-angular/core/domain';
import { Observable, of } from 'rxjs';

@Injectable()
export class LocalStorageTransactionRepository implements ITransactionRepository {
  private readonly STORAGE_KEY = 'transactions';

  private saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions.map((t) => t.toJSON())));
  }

  private getStoredTransactions(): Transaction[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];

    const data = JSON.parse(stored);
    return data.map((item: any) =>
      Transaction.create(item.id, item.type, item.amount, new Date(item.date), item.category),
    );
  }

  create(transaction: Transaction): Observable<Transaction> {
    const transactions = this.getStoredTransactions();
    transactions.push(transaction);
    this.saveTransactions(transactions);
    return of(transaction);
  }

  update(transaction: Transaction): Observable<Transaction> {
    const transactions = this.getStoredTransactions();
    const index = transactions.findIndex((t) => t.id === transaction.id);

    if (index === -1) {
      throw new Error('Transaction not found');
    }

    transactions[index] = transaction;
    this.saveTransactions(transactions);
    return of(transaction);
  }

  delete(id: string): Observable<void> {
    const transactions = this.getStoredTransactions();
    const filtered = transactions.filter((t) => t.id !== id);
    this.saveTransactions(filtered);
    return of(void 0);
  }

  getById(id: string): Observable<Transaction> {
    const transactions = this.getStoredTransactions();
    const transaction = transactions.find((t) => t.id === id);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return of(transaction);
  }

  getAll(): Observable<Transaction[]> {
    return of(this.getStoredTransactions());
  }

  getByDateRange(startDate: Date, endDate: Date): Observable<Transaction[]> {
    const transactions = this.getStoredTransactions();

    return of(
      transactions.filter((t) => {
        const date = t.date;
        return date >= startDate && date <= endDate;
      }),
    );
  }
}
