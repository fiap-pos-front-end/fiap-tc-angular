import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { emitEvent, EVENTS, Transaction, TransactionType } from '@fiap-pos-front-end/fiap-tc-shared';
import { TransactionService } from '@fiap-tc-angular/infrastructure';
import { MessageService } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-statement',
  imports: [DataView, Tag, CurrencyPipe, DatePipe],
  providers: [MessageService],
  templateUrl: './statement-page.component.html',
})
export class StatementComponent implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly transactionService = inject(TransactionService);

  readonly TransactionType = TransactionType;
  readonly transactions = signal<Transaction[]>([]);

  ngOnInit(): void {
    this.loadTransactions();
  }

  private loadTransactions() {
    this.transactionService.getAll().subscribe({
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
      if (transaction.type === TransactionType.INCOME) {
        return acc + transaction.amount.value;
      }

      return acc - transaction.amount.value;
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
