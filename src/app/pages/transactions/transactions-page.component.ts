import { Component, inject, OnInit } from '@angular/core';
import { emitEvent } from '@fiap-pos-front-end/fiap-tc-shared';
import { TransactionsListComponent } from '@fiap-tc-angular/components';
import { ID_GENERATOR_TOKEN, TRANSACTION_REPOSITORY_TOKEN } from '@fiap-tc-angular/core/application';
import { InMemoryTransactionRepository, UuidGeneratorRepository } from '@fiap-tc-angular/infrastructure';
import pt from 'primelocale/pt.json';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  imports: [TransactionsListComponent],
  providers: [
    { provide: TRANSACTION_REPOSITORY_TOKEN, useClass: InMemoryTransactionRepository },
    { provide: ID_GENERATOR_TOKEN, useClass: UuidGeneratorRepository },
  ],
})
export class TransactionsPageComponent implements OnInit {
  private readonly config = inject(PrimeNG);

  ngOnInit(): void {
    this.config.setTranslation(pt.pt);
    emitEvent('balanceChange', 123);
  }
}
