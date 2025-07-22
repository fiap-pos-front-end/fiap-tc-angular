import { Component, inject, OnInit } from '@angular/core';
import { emitEvent, EVENTS } from '@fiap-pos-front-end/fiap-tc-shared';
import { TransactionService } from '@fiap-tc-angular/infrastructure';

@Component({
  selector: 'app-statement',
  imports: [],
  templateUrl: './statement-page.component.html',
})
export class StatementComponent implements OnInit {
  private transactionService = inject(TransactionService);

  ngOnInit(): void {
    this.getAllTransactions();
  }

  private getAllTransactions() {
    this.transactionService.getAll().subscribe((transactions: any) => {
      const order = transactions.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

      emitEvent(EVENTS.TRANSACTIONS_UPDATED, order);
      // emitEvent(EVENTS.TOTAL_BALANCE, calculateBalance);
    });
  }
}

// private calculateBalance(transactions: TransactionDTO[]): number {
//   return transactions.reduce((acc, transaction) => {
//     if (transaction.type === 'RECEITA') {
//       return acc + transaction.amount;
//     }

//     return acc - transaction.amount;
//   }, 0);
// }

// import { CommonModule } from '@angular/common';
// import { Component, input } from '@angular/core';
// import { DataViewModule } from 'primeng/dataview';
// import { TagModule } from 'primeng/tag';

// @Component({
//   selector: 'app-statement',
//   standalone: true,
//   imports: [CommonModule, DataViewModule, TagModule],
//   templateUrl: './statement.component.html',
// })
// export class StatementComponent {
//   transactions = input([]);
// }
