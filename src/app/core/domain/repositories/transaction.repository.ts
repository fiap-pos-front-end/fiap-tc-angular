import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

export interface ITransactionRepository {
  create(transaction: Transaction): Observable<Transaction>;
  update(transaction: Transaction): Observable<Transaction>;
  delete(id: string): Observable<void>;
  getById(id: string): Observable<Transaction>;
  getAll(): Observable<Transaction[]>;
  getByDateRange(startDate: Date, endDate: Date): Observable<Transaction[]>;
}
