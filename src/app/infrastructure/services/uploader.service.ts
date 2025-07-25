import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Transaction,
  TransactionDTO,
  TransactionType,
  TransfersResponsePayload,
} from '@fiap-pos-front-end/fiap-tc-shared';

@Injectable({
  providedIn: 'root',
})
export class UploaderService {
  private readonly httpClient = inject(HttpClient);
  private readonly transactionBaseUrl = `${environment.apiUrl}/transfers`;

  update(id: number, transaction: {}): Observable<Transaction> {
    return this.httpClient
      .put<TransfersResponsePayload>(
        `${this.transactionBaseUrl}/${id}`,
        this.buildTransactionPayloadFromDTO(transaction),
      )
      .pipe(map((transaction) => this.mapTransactionPayloadToTransaction(transaction)));
  }

  //   update(id: number, transaction: any): Observable<Transaction> {
  //   const formData = new FormData();

  //   formData.append('amount', transaction.amount.toString());
  //   formData.append('type', transaction.type === TransactionType.INCOME ? 'RECEITA' : 'DESPESA');
  //   formData.append('date', transaction.date.toISOString());
  //   formData.append('categoryId', transaction.category.toString());

  //   if (transaction.files && transaction.files.length > 0) {
  //     transaction.files.forEach((file: File) => {
  //       formData.append('files', file);
  //     });
  //   }

  //   return this.httpClient
  //     .put<TransfersResponsePayload>(`${this.transactionBaseUrl}/${id}`, formData, {})
  //     .pipe(map((response) => this.mapTransactionPayloadToTransaction(response)));
  // }

  getFiles(id: string) {
    return this.httpClient.get(`${this.transactionBaseUrl}/${id}/attachments`);
  }

  private buildTransactionPayloadFromDTO(transaction: any): TransfersResponsePayload {
    return {
      amount: transaction.amount,
      type: transaction.type === TransactionType.INCOME ? 'RECEITA' : 'DESPESA',
      date: transaction.date.toISOString(),
      categoryId: Number(transaction.category),
      files: transaction.files,
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
