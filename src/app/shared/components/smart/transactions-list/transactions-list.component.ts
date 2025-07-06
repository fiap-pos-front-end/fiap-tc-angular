import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Transaction, TransactionType } from '@fiap-tc-angular/models';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-transactions-list',
  imports: [TableModule, CommonModule],
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.scss',
})
export class TransactionsListComponent {
  transactions: Transaction[] = [
    {
      id: '1',
      type: TransactionType.INCOME,
      amount: 100,
      date: new Date(),
      category: 'Salário',
    },
    {
      id: '2',
      type: TransactionType.EXPENSE,
      amount: 200,
      date: new Date(),
      category: 'alimentação',
    },
  ];
}
