/**
import { Injectable } from '@angular/core';
import { Transaction, TransactionType } from '@fiap-pos-front-end/fiap-tc-shared';
import { ITransactionRepository } from '@fiap-tc-angular/core/domain';
import { Observable, of } from 'rxjs';

@Injectable()
export class InMemoryTransactionRepository implements ITransactionRepository {
  transactions: Transaction[] = [
    {
      id: 1,
      type: TransactionType.RECEITA,
      amount: 100,
      date: new Date(),
      categoryId: 1,
      attachments: '',
      category: { id: 1, name: 'Salário', userId: 1 },
      userId: 1,
    },
    {
      id: 2,
      type: TransactionType.DESPESA,
      amount: 200,
      date: new Date(),
      categoryId: 1,
      attachments: '',
      category: { id: 2, name: 'alimentação', userId: 1 },
      userId: 1,
    },
    {
      id: 3,
      type: TransactionType.RECEITA,
      amount: 300,
      date: new Date(),
      categoryId: 1,
      attachments: '',
      category: { id: 3, name: 'Proventos', userId: 1 },
      userId: 1,
    },
  ];

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

  delete(id: number): Observable<void> {
    const index = this.transactions.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error('Transaction not found');
    }

    this.transactions.splice(index, 1);
    return of(void 0);
  }

  getById(id: number): Observable<Transaction> {
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
 */
