import { Component } from '@angular/core';
import { HttpTransactionRepository } from '@fiap-tc-angular/infra/repositories/HttpTransactionRepository';
import { UuidIdGeneratorService } from '@fiap-tc-angular/infra/services/UuidIdGeneratorService';
import { ID_GENERATOR_SERVICE_TOKEN } from '@fiap-tc-angular/infra/tokens/IdGeneratorService';
import { TRANSACTION_REPOSITORY_TOKEN } from '@fiap-tc-angular/infra/tokens/TransactionRepository';
import { TransactionsListComponent } from '../../components/';
import { TRANSACTION_USE_CASES_PROVIDERS } from '../../providers/transaction-use-cases.provider';

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  imports: [TransactionsListComponent],
  providers: [
    // Infra
    { provide: ID_GENERATOR_SERVICE_TOKEN, useClass: UuidIdGeneratorService },
    { provide: TRANSACTION_REPOSITORY_TOKEN, useClass: HttpTransactionRepository },

    // Use Cases (via factory providers)
    ...TRANSACTION_USE_CASES_PROVIDERS,
  ],
})
export class TransactionsPageComponent {}
