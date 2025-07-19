import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CategoryDTO } from '@fiap-pos-front-end/fiap-tc-shared';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly httpClient = inject(HttpClient);

  private readonly categoryBaseUrl = `${environment.apiUrl}/categories`;

  getAll(): Observable<CategoryDTO[]> {
    return this.httpClient.get<CategoryDTO[]>(this.categoryBaseUrl);
  }
}
