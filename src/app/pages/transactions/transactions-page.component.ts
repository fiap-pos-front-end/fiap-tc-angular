import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TransactionsListComponent } from '@fiap-tc-angular/components';
import { ID_GENERATOR_TOKEN, TRANSACTION_REPOSITORY_TOKEN } from '@fiap-tc-angular/core/application';
import { ApiTransactionRepository, CategoryService, UuidGeneratorRepository } from '@fiap-tc-angular/infrastructure';

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  imports: [AsyncPipe, TransactionsListComponent],
  providers: [
    { provide: TRANSACTION_REPOSITORY_TOKEN, useClass: ApiTransactionRepository },
    { provide: ID_GENERATOR_TOKEN, useClass: UuidGeneratorRepository },
  ],
})
export class TransactionsPageComponent {
  private readonly categoryService = inject(CategoryService);

  readonly categories$ = this.categoryService.getAll();
}
