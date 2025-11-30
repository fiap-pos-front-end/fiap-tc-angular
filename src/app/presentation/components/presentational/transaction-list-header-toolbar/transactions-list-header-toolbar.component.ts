import { Component, input, InputSignal, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Transaction } from '@fiap-pos-front-end/fiap-tc-shared';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Toolbar } from 'primeng/toolbar';

@Component({
  selector: 'app-transactions-list-header-toolbar',
  imports: [Button, IconField, InputIcon, InputTextModule, Toolbar, FormsModule],
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
  readonly onFiltersClearClicked = output<void>({ alias: 'onFiltersClear' });

  searchInput = signal<string>('');

  onNewTransactionClick() {
    this.onNewTransactionClicked.emit();
  }

  onDeleteSelectedTransactionsClick() {
    this.onDeleteSelectedTransactionsClicked.emit();
  }

  onExportCsvClick() {
    this.onExportCsvClicked.emit();
  }

  onFiltersClear() {
    this.searchInput.set('');
    this.onFiltersClearClicked.emit();
  }
}
