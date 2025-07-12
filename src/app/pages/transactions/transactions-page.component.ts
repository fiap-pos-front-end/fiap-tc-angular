import { Component, OnInit } from '@angular/core';
import { emitEvent } from '@fiap-pos-front-end/fiap-tc-shared';
import { TransactionsListComponent } from '@fiap-tc-angular/components';

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  imports: [TransactionsListComponent],
})
export class TransactionsPageComponent implements OnInit {
  ngOnInit(): void {
    emitEvent('balanceChange', 123);
  }
}
