import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpBackend } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UploaderService {
  //Preciso criar como rawHttp pois S3 bloqueia requisições com token JWT em repo. público
  private readonly handler = inject(HttpBackend);
  private readonly rawHttp = new HttpClient(this.handler);

  uploadPublicFile(file: File): Promise<string> {
    const fullUrl = `${environment.S3Url}/${file.name}`;

    return firstValueFrom(
      this.rawHttp.put(fullUrl, file, {
        headers: { 'Content-Type': file.type },
        reportProgress: true,
        observe: 'response',
      }),
    ).then(() => fullUrl);
  }

  deletePublicFile(fileName: string): Observable<any> {
    const fullUrl = `${environment.S3Url}/${fileName}`;
    return this.rawHttp.delete(fullUrl, {
      observe: 'response',
    });
  }
}
