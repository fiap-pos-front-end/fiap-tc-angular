import { Injectable, inject } from '@angular/core';
import { ID_GENERATOR_TOKEN, TRANSACTION_REPOSITORY_TOKEN } from '@fiap-tc-angular/core/application';
import { Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { Observable } from 'rxjs';

export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  category: string;
  date: Date;
}

// Note: se a gente quisesse, esse serviço poderia ser dividido em vários casos de uso (ex: createTransaction, updateTransaction, deleteTransaction, etc.)
@Injectable({
  providedIn: 'root',
})
export class ManageTransactionsUseCaseService {
  private idGenerator = inject(ID_GENERATOR_TOKEN);
  private repository = inject(TRANSACTION_REPOSITORY_TOKEN);

  public getAllTransactions(): Observable<Transaction[]> {
    return this.repository.getAll();
  }

  public createTransaction(dto: CreateTransactionDTO): Observable<Transaction> {
    const transaction = Transaction.create(this.idGenerator.generate(), dto.type, dto.amount, dto.date, dto.category);

    return this.repository.create(transaction);
  }

  public updateTransaction(id: string, dto: CreateTransactionDTO): Observable<Transaction> {
    const transaction = Transaction.create(id, dto.type, dto.amount, dto.date || new Date(), dto.category);

    return this.repository.update(transaction);
  }

  public deleteTransaction(id: string): Observable<void> {
    return this.repository.delete(id);
  }
}
