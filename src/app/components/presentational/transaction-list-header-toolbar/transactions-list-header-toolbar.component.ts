import { Component, input, InputSignal, output } from '@angular/core';
import { Transaction } from '@fiap-tc-angular/core/domain';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Toolbar } from 'primeng/toolbar';

@Component({
  selector: 'app-transactions-list-header-toolbar',
  imports: [Button, IconField, InputIcon, InputTextModule, Toolbar],
  templateUrl: './transactions-list-header-toolbar.component.html',
  styles: `
    :host ::ng-deep {
      @media only screen and (min-width: 768px) {
        .p-toolbar-center {
          flex: 1;
          max-width: 60%;
          margin: 0 auto;
        }
      }
    }
  `,
})
export class TransactionsListHeaderToolbarComponent {
  readonly selectedTransactions: InputSignal<Transaction[]> = input.required<Transaction[]>();

  readonly onNewTransactionClicked = output<void>();
  readonly onDeleteSelectedTransactionsClicked = output<void>();
  readonly onExportCsvClicked = output<void>();
  readonly onSearchInput = output<Event>();

  onNewTransactionClick() {
    this.onNewTransactionClicked.emit();
  }

  onDeleteSelectedTransactionsClick() {
    this.onDeleteSelectedTransactionsClicked.emit();
  }

  onExportCsvClick() {
    this.onExportCsvClicked.emit();
  }
}
