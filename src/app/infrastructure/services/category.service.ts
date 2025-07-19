import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// TODO: move to shared/types
export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly httpClient = inject(HttpClient);

  private readonly categoryBaseUrl = `${environment.apiUrl}/categories`;

  getAll(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.categoryBaseUrl);
  }
}
