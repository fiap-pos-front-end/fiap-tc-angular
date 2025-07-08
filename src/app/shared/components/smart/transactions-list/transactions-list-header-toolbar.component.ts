import { Component, inject, input, InputSignal, output } from '@angular/core';
import { Transaction } from '@fiap-tc-angular/core/domain';
import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { FileUpload } from 'primeng/fileupload';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Toolbar } from 'primeng/toolbar';

@Component({
  selector: 'app-transactions-list-header-toolbar',
  imports: [
    Button,
    ConfirmDialogModule,
    ConfirmPopupModule,
    FileUpload,
    IconField,
    InputIcon,
    InputTextModule,
    Toolbar,
  ],
  templateUrl: './transactions-list-header-toolbar.component.html',
})
export class TransactionsListHeaderToolbarComponent {
  private confirmationService = inject(ConfirmationService);

  readonly selectedTransactions: InputSignal<Transaction[]> = input.required<Transaction[]>();

  readonly onNewTransactionClicked = output<void>();
  readonly onDeleteSelectedTransactionsClicked = output<void>();
  readonly onExportCsvClicked = output<void>();

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
