import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ITransactionRepository, Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

type TransactionPayload = {
  accountId: string;
  value: number;
  type: 'Credit' | 'Debit';
  categoryId?: string;
  anexo?: string;
};

@Injectable()
export class ApiTransactionRepository implements ITransactionRepository {
  private readonly httpClient = inject(HttpClient);

  private readonly transactionBaseUrl = `${environment.apiUrl}/account/transaction`;

  create(transaction: Transaction): Observable<Transaction> {
    return this.httpClient.post<Transaction>(this.transactionBaseUrl, this.buildTransactionPayload(transaction), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikpvw6NvIiwiZW1haWwiOiJqb2FvQHRlc3RlLmNvbSIsInBhc3N3b3JkIjoiMTIzNCIsImlkIjoiNjg3N2Y0M2Y4YzAzZjg3N2RiN2NhYjFlIiwiaWF0IjoxNzUyNjkxNzc5LCJleHAiOjE3NTI3MzQ5Nzl9.Uk_n7y6jwOb-DsV9t-X-A4G49EBBcpGEvJupAZkVKmU`,
      }),
    });
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
      accountId: '67607133f840bb97892eb659', // Note: we're NOT using multiple accounts yet
      value: transaction.amount.getValue(),
      type: transaction.type === TransactionType.INCOME ? 'Credit' : 'Debit',
      categoryId: '6877f4858c03f877db7cab25', // Note: API está exigindo isso, mesmo que não esteja documentado
    };
  }
}
