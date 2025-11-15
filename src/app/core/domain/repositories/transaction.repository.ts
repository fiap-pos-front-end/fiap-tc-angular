import { Transaction } from '@fiap-pos-front-end/fiap-tc-shared';
import { Observable } from 'rxjs';

export interface ITransactionRepository {
  create(transaction: Transaction): Observable<Transaction>;
  delete(id: number): Observable<void>;
  getAll(): Observable<Transaction[]>;
  update(transaction: Transaction): Observable<Transaction>;
  getById(id: number): Observable<Transaction>;
  getByDateRange(startDate: Date, endDate: Date): Observable<Transaction[]>;
}
