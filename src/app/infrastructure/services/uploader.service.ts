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
  uploadAttachments(id: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.httpClient.put(`${this.transactionBaseUrl}/${id}/attachments`, formData);
  }

  getFiles(id: number) {
    return this.httpClient.get(`${this.transactionBaseUrl}/${id}/attachments`);
  }

  private buildTransactionPayloadFromDTO(transaction: any): TransfersResponsePayload {
    return {
      amount: transaction.amount,
      type: transaction.type === TransactionType.INCOME ? 'RECEITA' : 'DESPESA',
      date: transaction.date.toISOString(),
      categoryId: Number(transaction.category),
      attachments: transaction.files,
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
