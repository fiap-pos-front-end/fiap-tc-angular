import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Transaction } from '../../core/domain/models/transaction.model';
import { ITransactionRepository } from '../../core/domain/repositories/transaction.repository';

@Injectable({
  providedIn: 'root',
})
export class InMemoryTransactionRepository implements ITransactionRepository {
  private transactions: Transaction[] = [];

  create(transaction: Transaction): Observable<Transaction> {
    this.transactions.push(transaction);
    return of(transaction);
  }

  update(transaction: Transaction): Observable<Transaction> {
    const index = this.transactions.findIndex((t) => t.id === transaction.id);

    if (index === -1) {
      throw new Error('Transaction not found');
    }

    this.transactions[index] = transaction;
    return of(transaction);
  }

  delete(id: string): Observable<void> {
    const index = this.transactions.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error('Transaction not found');
    }

    this.transactions.splice(index, 1);
    return of(void 0);
  }

  getById(id: string): Observable<Transaction> {
    const transaction = this.transactions.find((t) => t.id === id);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return of(transaction);
  }

  getAll(): Observable<Transaction[]> {
    return of(this.transactions);
  }

  getByDateRange(startDate: Date, endDate: Date): Observable<Transaction[]> {
    const filtered = this.transactions.filter((t) => {
      const date = t.date;
      return date >= startDate && date <= endDate;
    });

    return of(filtered);
  }
}
