import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Transaction } from '@fiap-pos-front-end/fiap-tc-shared';
import { ITransactionRepository } from '@fiap-tc-angular/core/domain';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

type TransactionPayload = {
  amount: number;
  type: string;
  date: string;
  categoryId?: number;
  anexo?: string;
};

@Injectable()
export class ApiTransactionRepository implements ITransactionRepository {
  private readonly httpClient = inject(HttpClient);

  private readonly transactionBaseUrl = `${environment.apiUrl}/transfers`;

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
  getAll(): Observable<Transaction[]> {
    throw new Error('Method not implemented.');
  }
  getByDateRange(startDate: Date, endDate: Date): Observable<Transaction[]> {
    throw new Error('Method not implemented.');
  }

  private buildTransactionPayload(transaction: Transaction): TransactionPayload {
    return {
      amount: transaction.amount.getValue(),
      type: transaction.type.toUpperCase(),
      date: transaction.date.toISOString(),
      categoryId: 1,
    };
  }
}
