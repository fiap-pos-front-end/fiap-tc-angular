import { Component } from '@angular/core';
import { TransactionsListComponent } from '@fiap-tc-angular/components';

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  imports: [TransactionsListComponent],
})
export class TransactionsPageComponent {}
