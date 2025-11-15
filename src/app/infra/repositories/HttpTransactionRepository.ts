import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TransactionDTO } from '@fiap-tc-angular/data/dtos/TransactionDTO';
import { TransactionMapper } from '@fiap-tc-angular/data/mappers/TransactionMapper';
import { TransactionRepository } from '@fiap-tc-angular/domain/repositories/TransactionRepository';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction } from '../../domain/entities/Transaction';

@Injectable()
export class HttpTransactionRepository implements TransactionRepository {
  private readonly httpClient = inject(HttpClient);

  private readonly transactionBaseUrl = `${environment.apiUrl}/transactions`;

  getAll(): Observable<Transaction[]> {
    return this.httpClient
      .get<TransactionDTO[]>(this.transactionBaseUrl)
      .pipe(map((dtos) => dtos.map(TransactionMapper.fromDtoToDomain)));
  }

  create(transaction: Transaction): Observable<Transaction> {
    return this.httpClient.post<Transaction>(this.transactionBaseUrl, transaction);
  }

  update(id: number, transaction: Transaction): Observable<Transaction> {
    return this.httpClient.put<Transaction>(`${this.transactionBaseUrl}/${id}`, transaction);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.transactionBaseUrl}/${id}`);
  }
}
