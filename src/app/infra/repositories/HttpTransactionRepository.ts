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
    const dto = TransactionMapper.fromDomainToDto(transaction);

    return this.httpClient
      .post<TransactionDTO>(this.transactionBaseUrl, dto)
      .pipe(map((responseDto) => TransactionMapper.fromDtoToDomain(responseDto)));
  }

  update(id: number, transaction: Transaction): Observable<Transaction> {
    const dto = TransactionMapper.fromDomainToDto(transaction);

    return this.httpClient
      .put<TransactionDTO>(`${this.transactionBaseUrl}/${id}`, dto)
      .pipe(map((responseDto) => TransactionMapper.fromDtoToDomain(responseDto)));
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.transactionBaseUrl}/${id}`);
  }
}
