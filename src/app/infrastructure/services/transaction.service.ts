import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

type TransactionDTO = {
  id?: string;
  amount: number;
  category: number;
  date: Date;
  type: TransactionType;
};

type TransactionPayload = {
  id?: number;
  amount: number;
  type: 'RECEITA' | 'DESPESA';
  date: string;
  categoryId: number;
  attachments?: string;
};

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly httpClient = inject(HttpClient);

  private readonly transactionBaseUrl = `${environment.apiUrl}/transfers`;

  getAll(): Observable<Transaction[]> {
    return this.httpClient
      .get<TransactionPayload[]>(this.transactionBaseUrl)
      .pipe(
        map((transactions) => transactions.map((transaction) => this.mapTransactionPayloadToTransaction(transaction))),
      );
  }

  create(transaction: TransactionDTO): Observable<Transaction> {
    return this.httpClient
      .post<TransactionPayload>(this.transactionBaseUrl, this.buildTransactionPayloadFromDTO(transaction))
      .pipe(map((transaction) => this.mapTransactionPayloadToTransaction(transaction)));
  }

  update(transaction: Transaction): Observable<Transaction> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
  getById(id: string): Observable<Transaction> {
    throw new Error('Method not implemented.');
  }

  getByDateRange(startDate: Date, endDate: Date): Observable<Transaction[]> {
    throw new Error('Method not implemented.');
  }

  private buildTransactionPayloadFromDTO(transaction: TransactionDTO): TransactionPayload {
    return {
      amount: transaction.amount,
      type: transaction.type === TransactionType.INCOME ? 'RECEITA' : 'DESPESA',
      date: transaction.date.toISOString(),
      categoryId: transaction.category,
    };
  }

  private mapTransactionPayloadToTransaction(transaction: TransactionPayload): Transaction {
    return Transaction.create(
      transaction.id?.toString() || '',
      transaction.type === 'RECEITA' ? TransactionType.INCOME : TransactionType.EXPENSE,
      transaction.amount,
      new Date(transaction.date),
      transaction.categoryId.toString(),
    );
  }
}
