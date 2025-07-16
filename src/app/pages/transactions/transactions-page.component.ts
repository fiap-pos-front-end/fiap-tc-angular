import { Component, OnInit } from '@angular/core';
import { emitEvent } from '@fiap-pos-front-end/fiap-tc-shared';
import { TransactionsListComponent } from '@fiap-tc-angular/components';
import { ID_GENERATOR_TOKEN, TRANSACTION_REPOSITORY_TOKEN } from '@fiap-tc-angular/core/application';
import { ApiTransactionRepository, UuidGeneratorRepository } from '@fiap-tc-angular/infrastructure';

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  imports: [TransactionsListComponent],
  providers: [
    { provide: TRANSACTION_REPOSITORY_TOKEN, useClass: ApiTransactionRepository },
    { provide: ID_GENERATOR_TOKEN, useClass: UuidGeneratorRepository },
  ],
})
export class TransactionsPageComponent implements OnInit {
  ngOnInit(): void {
    emitEvent('balanceChange', 123);
  }
}
