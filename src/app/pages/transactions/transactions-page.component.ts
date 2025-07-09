import { Component, OnInit } from '@angular/core';
import { TransactionsListComponent } from '@fiap-tc-angular/components';
import { emitEvent } from '@fiap-pos-front-end/fiap-tc-shared';

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  imports: [TransactionsListComponent],
})
export class TransactionsPageComponent implements OnInit {
  ngOnInit(): void {
    emitEvent('balanceChanged', 123);
  }
}
