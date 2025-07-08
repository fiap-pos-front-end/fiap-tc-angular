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
  readonly onExportCsvClicked = output<void>();

  onNewTransactionClick() {
    this.onNewTransactionClicked.emit();
  }

  onDeleteSelectedTransactionsClick() {
    this.deleteSelectedTransactions();
  }

  onExportCsvClick() {
    this.onExportCsvClicked.emit();
  }

  // TODO: Criar um EventEmitter para deletar as transações selecionadas
  private deleteSelectedTransactions() {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja deletar as transações selecionadas?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Não',
        severity: 'secondary',
        variant: 'text',
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Sim',
      },
      accept: () => {
        // TODO: [MESMA COISA] aqui não é mais o componente que aplica essa regra, e sim os serviços que criamos
        // this.transactions = this.transactions.filter((val) => !this.selectedTransactions?.includes(val));
        // this.selectedTransactions = null;
        // ------------------------------------------------------------
        // TODO: Emitir um evento para exibir o toast
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Sucesso',
        //   detail: 'Transações Deletadas',
        //   life: 3000,
        // });
      },
    });
  }
}
