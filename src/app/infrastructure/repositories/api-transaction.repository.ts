import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ITransactionRepository, Transaction } from '@fiap-tc-angular/core/domain';
import { Observable, of } from 'rxjs';
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
    this.httpClient
      .post<any>(
        `${environment.apiUrl}/categories`,
        { name: 'Luz' },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9hb0B0ZXN0ZS5jb20iLCJpYXQiOjE3NTI3MTM2OTIsImV4cCI6MTc1MjcxNzI5Mn0.1orGUZrYtFrhCD7T05fM7FYhlKt3ITFss0--4MN2PzU`,
          }),
        },
      )
      .subscribe((response) => {
        console.log(response);
        return this.httpClient
          .post<Transaction>(this.transactionBaseUrl, this.buildTransactionPayload(transaction), {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9hb0B0ZXN0ZS5jb20iLCJpYXQiOjE3NTI3MTM2OTIsImV4cCI6MTc1MjcxNzI5Mn0.1orGUZrYtFrhCD7T05fM7FYhlKt3ITFss0--4MN2PzU`,
            }),
          })
          .subscribe((response) => {
            console.log(response);
          });
      });

    return of(transaction);
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
