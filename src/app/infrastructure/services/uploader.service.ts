import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
export interface Arquivo {
  contentType: string;
  data: string;
  filename: string;
}
@Injectable({
  providedIn: 'root',
})
export class UploaderService {
  private readonly httpClient = inject(HttpClient);
  private readonly transactionBaseUrl = `${environment.apiUrl}/transactions`;

  uploadAttachments(id: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.httpClient.put(`${this.transactionBaseUrl}/${id}/attachments`, formData);
  }

  getFiles(id: number): Observable<Arquivo[]> {
    return this.httpClient.get<Arquivo[]>(`${this.transactionBaseUrl}/${id}/attachments`);
  }
}
