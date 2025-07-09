import { Injectable, inject } from '@angular/core';
import { ID_GENERATOR_TOKEN, TRANSACTION_REPOSITORY_TOKEN } from '@fiap-tc-angular/core/application';
import { BalanceService, Money, Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { Observable, map } from 'rxjs';

export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  category: string;
  date?: Date;
}

export interface TransactionSummaryDTO {
  balance: Money;
  totalIncomes: Money;
  totalExpenses: Money;
  transactions: Transaction[];
}

// Note: se a gente quisesse, esse serviço poderia ter virado vários casos de uso (ex: createTransaction, updateTransaction, deleteTransaction, etc.)
@Injectable({
  providedIn: 'root',
})
export class ManageTransactionsUseCaseService {
  private balanceService = inject(BalanceService);
  private repository = inject(TRANSACTION_REPOSITORY_TOKEN);
  private idGenerator = inject(ID_GENERATOR_TOKEN);

  public createTransaction(dto: CreateTransactionDTO): Observable<Transaction> {
    const transaction = Transaction.create(
      this.idGenerator.generate(),
      dto.type,
      dto.amount,
      dto.date || new Date(),
      dto.category,
    );

    return this.repository.create(transaction);
  }

  public updateTransaction(id: string, dto: CreateTransactionDTO): Observable<Transaction> {
    const transaction = Transaction.create(id, dto.type, dto.amount, dto.date || new Date(), dto.category);

    return this.repository.update(transaction);
  }

  public deleteTransaction(id: string): Observable<void> {
    return this.repository.delete(id);
  }

  public getTransactionById(id: string): Observable<Transaction> {
    return this.repository.getById(id);
  }

  public getAllTransactions(): Observable<Transaction[]> {
    return this.repository.getAll();
  }

  public getTransactionSummary(): Observable<TransactionSummaryDTO> {
    return this.repository.getAll().pipe(
      map((transactions) => ({
        balance: this.balanceService.calculateBalance(transactions),
        totalIncomes: this.balanceService.calculateIncomes(transactions),
        totalExpenses: this.balanceService.calculateExpenses(transactions),
        transactions,
      })),
    );
  }

  public getTransactionsByPeriod(startDate: Date, endDate: Date): Observable<Transaction[]> {
    return this.repository.getByDateRange(startDate, endDate);
  }
}
