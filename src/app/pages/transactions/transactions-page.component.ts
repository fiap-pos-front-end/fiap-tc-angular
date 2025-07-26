import { Component } from '@angular/core';
import { TransactionsListComponent } from '@fiap-tc-angular/components';
import { ID_GENERATOR_TOKEN } from '@fiap-tc-angular/core/application';
import { UuidGeneratorRepository } from '@fiap-tc-angular/infrastructure';

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  imports: [TransactionsListComponent],
  providers: [{ provide: ID_GENERATOR_TOKEN, useClass: UuidGeneratorRepository }],
})
export class TransactionsPageComponent {}
