import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { emitEvent, EVENTS, TransactionType } from '@fiap-pos-front-end/fiap-tc-shared';
import { Transaction } from '@fiap-tc-angular/domain/entities/Transaction';
import { TransactionRepository } from '@fiap-tc-angular/domain/repositories/TransactionRepository';
import { GetAllTransactionsUseCase } from '@fiap-tc-angular/domain/usecases/GetAllTransactionsUseCase';
import { HttpTransactionRepository } from '@fiap-tc-angular/infra/repositories/HttpTransactionRepository';
import { TRANSACTION_REPOSITORY_TOKEN } from '@fiap-tc-angular/infra/tokens/TransactionRepository';
import { MessageService } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-statement',
  imports: [DataView, Tag, CurrencyPipe, DatePipe],
  providers: [
    MessageService,

    // Infra
    { provide: TRANSACTION_REPOSITORY_TOKEN, useClass: HttpTransactionRepository },

    // Use Cases
    {
      provide: GetAllTransactionsUseCase,
      useFactory: (transactionRepository: TransactionRepository) => {
        return new GetAllTransactionsUseCase(transactionRepository);
      },
      deps: [TRANSACTION_REPOSITORY_TOKEN],
    },
  ],
  templateUrl: './statement-page.component.html',
})
export class StatementComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);
  private readonly getAllTransactionsUseCase = inject(GetAllTransactionsUseCase);

  readonly TransactionType = TransactionType;
  readonly transactions = signal<Transaction[]>([]);

  ngOnInit(): void {
    this.loadTransactions();
  }

  private loadTransactions() {
    this.getAllTransactionsUseCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (transactionsList) => {
          const orderedTransactions = transactionsList.sort(
            (a: Transaction, b: Transaction) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );

          this.transactions.set(orderedTransactions);
          this.onTransactionsUpdated(orderedTransactions);
        },
        error: (error) => this.showErrorMessage('Erro ao carregar transações', error.message),
      });
  }

  private onTransactionsUpdated(transactions: Transaction[]) {
    const balance = this.calculateBalance(transactions);

    emitEvent(EVENTS.TRANSACTIONS_UPDATED, this.transactions());
    emitEvent('balance-updated', balance);
  }

  private calculateBalance(transactions: Transaction[]): number {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === TransactionType.RECEITA) {
        return acc + transaction.amount;
      }

      return acc - transaction.amount;
    }, 0);
  }

  private showErrorMessage(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 5000,
    });
  }
}
