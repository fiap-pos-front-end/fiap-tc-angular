import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Transaction, TransactionType, TransfersResponsePayload } from '@fiap-pos-front-end/fiap-tc-shared';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// TODO: atualizar esse tipo para o TransactionDTO do shared (porém, como vai precisar mexer no form, deixei para depois)
type TransactionDTO = {
  id?: string;
  amount: number;
  category: number;
  date: Date;
  type: TransactionType;
};

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly httpClient = inject(HttpClient);

  private readonly transactionBaseUrl = `${environment.apiUrl}/transfers`;

  getAll(): Observable<Transaction[]> {
    return this.httpClient
      .get<TransfersResponsePayload[]>(this.transactionBaseUrl)
      .pipe(
        map((transactions) => transactions.map((transaction) => this.mapTransactionPayloadToTransaction(transaction))),
      );
  }

  create(transaction: TransactionDTO): Observable<Transaction> {
    return this.httpClient
      .post<TransfersResponsePayload>(this.transactionBaseUrl, this.buildTransactionPayloadFromDTO(transaction))
      .pipe(map((transaction) => this.mapTransactionPayloadToTransaction(transaction)));
  }

  update(id: string, transaction: TransactionDTO): Observable<Transaction> {
    return this.httpClient
      .put<TransfersResponsePayload>(
        `${this.transactionBaseUrl}/${id}`,
        this.buildTransactionPayloadFromDTO(transaction),
      )
      .pipe(map((transaction) => this.mapTransactionPayloadToTransaction(transaction)));
  }

  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.transactionBaseUrl}/${id}`);
  }

  getById(id: string): Observable<Transaction> {
    throw new Error('Method not implemented.');
  }

  getByDateRange(startDate: Date, endDate: Date): Observable<Transaction[]> {
    throw new Error('Method not implemented.');
  }

  private buildTransactionPayloadFromDTO(transaction: TransactionDTO): TransfersResponsePayload {
    return {
      amount: transaction.amount,
      type: transaction.type === TransactionType.INCOME ? 'RECEITA' : 'DESPESA',
      date: transaction.date.toISOString(),
      categoryId: transaction.category,
    };
  }

  private mapTransactionPayloadToTransaction(transaction: TransfersResponsePayload): Transaction {
    return Transaction.create(
      transaction.id?.toString() || '',
      transaction.type === 'RECEITA' ? TransactionType.INCOME : TransactionType.EXPENSE,
      transaction.amount,
      new Date(transaction.date),
      transaction.categoryId.toString(),
    );
  }
}
