import { Observable } from 'rxjs';
import { Transaction } from '../entities/Transaction';

/**
 * Why do we need Promise (or Observables)?
 * The reasoning:
 *  - Your domain defines the repository interface
 *  - The domain doesn't know if data comes from:
 *    - HTTP API (async)
 *    - Database (async)
 *    - Memory (could be sync)
 *    - File system (async)
 *  - Since most real implementations are async, the interface uses Promise
 * This way, the domain says: "I need transaction data, and I understand it might take time"
 *
 * So, I left it as Observables to simplify right now, but I'd like to keep it as Promise because
 *  it's framework-agnostic, but then I'll need to map it to Observable twice.
 */

export interface TransactionRepository {
  getAll(): Observable<Transaction[]>;
  create(transaction: Transaction): Observable<Transaction>;
  update(id: number, transaction: Transaction): Observable<Transaction>;
  delete(id: number): Observable<void>;
}
