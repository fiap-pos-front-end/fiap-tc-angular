import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TransactionsListComponent } from '@fiap-tc-angular/components';
import { ID_GENERATOR_TOKEN } from '@fiap-tc-angular/core/application';
import { CategoryService, UuidGeneratorRepository } from '@fiap-tc-angular/infrastructure';

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  imports: [AsyncPipe, TransactionsListComponent],
  providers: [{ provide: ID_GENERATOR_TOKEN, useClass: UuidGeneratorRepository }],
})
export class TransactionsPageComponent {
  private readonly categoryService = inject(CategoryService);

  readonly categories$ = this.categoryService.getAll();
}
