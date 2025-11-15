import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TransactionRepository } from '@fiap-tc-angular/domain/repositories/TransactionRepository';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction } from '../../domain/entities/Transaction';

@Injectable()
export class HttpTransactionRepository implements TransactionRepository {
  private readonly httpClient = inject(HttpClient);

  private readonly transactionBaseUrl = `${environment.apiUrl}/transactions`;

  getAll(): Observable<Transaction[]> {
    return this.httpClient.get<Transaction[]>(this.transactionBaseUrl);
  }

  create(transaction: Transaction): Observable<Transaction> {
    return this.httpClient.post<Transaction>(this.transactionBaseUrl, transaction);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.transactionBaseUrl}/${id}`);
  }
}
