import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

type TransactionPayload = {
  id: number;
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
        map((transactions) =>
          transactions.map((transaction) =>
            Transaction.create(
              transaction.id.toString(),
              transaction.type === 'RECEITA' ? TransactionType.INCOME : TransactionType.EXPENSE,
              transaction.amount,
              new Date(transaction.date),
              transaction.categoryId.toString(),
            ),
          ),
        ),
      );
  }

  create(transaction: Transaction): Observable<Transaction> {
    return this.httpClient.post<Transaction>(this.transactionBaseUrl, this.buildTransactionPayload(transaction));
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

  private buildTransactionPayload(transaction: Transaction): Omit<TransactionPayload, 'id'> {
    return {
      amount: transaction.amount.getValue(),
      type: transaction.type === TransactionType.INCOME ? 'RECEITA' : 'DESPESA',
      date: transaction.date.toISOString(),
      categoryId: 1,
    };
  }
}
