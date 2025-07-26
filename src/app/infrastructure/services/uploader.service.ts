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

  uploadAttachments(id: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.httpClient.put(`${this.transactionBaseUrl}/${id}/attachments`, formData);
  }

  getFiles(id: number) {
    return this.httpClient.get(`${this.transactionBaseUrl}/${id}/attachments`);
  }
}
