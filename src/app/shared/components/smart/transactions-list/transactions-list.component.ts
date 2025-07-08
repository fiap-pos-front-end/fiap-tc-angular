import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { ManageTransactionsUseCaseService } from '@fiap-tc-angular/core/application';
import { Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { inMemoryTransactionProvider } from '@fiap-tc-angular/infrastructure';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { TransactionFormComponent } from '../../presentational/transaction-form/transaction-form.component';
import { ImportsModule } from './imports';
import { TransactionsListHeaderToolbarComponent } from './transactions-list-header-toolbar.component';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-transactions-list',
  imports: [
    ImportsModule,
    CommonModule,
    TransactionsListHeaderToolbarComponent,
    TransactionFormComponent,
    ConfirmDialogModule,
    ConfirmPopupModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    ManageTransactionsUseCaseService,
    inMemoryTransactionProvider,
    AsyncPipe,
  ],
  templateUrl: './transactions-list.component.html',
})
export class TransactionsListComponent implements OnInit {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private manageTransactionsUseCase = inject(ManageTransactionsUseCaseService);

  // TODO: Transformar em Signals
  submitted: boolean = false;
  newTransactionDialog: boolean = false;
  cols!: Column[];
  exportColumns!: ExportColumn[];
  @ViewChild('dt') dt!: Table;
  selectedTransactions: Transaction[] = [];
  transaction: WritableSignal<Transaction> = signal<Transaction>(Transaction.reset());
  transactions$: Observable<Transaction[]> = new Observable<Transaction[]>();

  ngOnInit() {
    this.prepareColumns();
    this.loadTransactions();
  }

  private prepareColumns(): void {
    this.cols = [
      { field: 'id', header: '#', customExportHeader: 'ID da Transação' },
      { field: 'type', header: 'Tipo' },
      { field: 'amount', header: 'Valor' },
      { field: 'category', header: 'Categoria' },
      { field: 'date', header: 'Data' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  private loadTransactions(): void {
    this.transactions$ = this.manageTransactionsUseCase.getAllTransactions();
  }

  private createConfirmationDialog(message: string, onAccept: () => void) {
    this.confirmationService.confirm({
      message,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: { label: 'Não', severity: 'secondary', variant: 'text' },
      acceptButtonProps: { severity: 'danger', label: 'Sim' },
      accept: () => {
        onAccept();

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Ação realizada com sucesso',
          life: 3000,
        });
      },
    });
  }

  openNewTransactionDialog() {
    this.transaction.set(Transaction.reset());
    // this.submitted = false; // TODO: entender melhor como vou controlar essa propriedade
    this.newTransactionDialog = true;
  }

  hideNewTransactionDialog() {
    this.newTransactionDialog = false;
    // this.submitted = false; // TODO: entender melhor como vou controlar essa propriedade
  }

  onSearchInput(event: Event) {
    this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onExportCsvClicked() {
    this.dt.exportCSV();
  }

  getTransactionTypeColor(type: TransactionType) {
    switch (type) {
      case TransactionType.INCOME:
        return 'success';
      case TransactionType.EXPENSE:
        return 'danger';
      default:
        return 'info';
    }
  }

  editTransaction(transaction: Transaction) {
    // TODO: corrigir a exibição do tipo da transação no form
    this.transaction.set(transaction);
    this.newTransactionDialog = true;
  }

  saveTransaction() {
    this.submitted = true;

    if (this.transaction().amount.value <= 0) {
      // TODO: talvez exibir mensagem de erro aqui? Pq já tem uma no form
      // this.messageService.add({
      //   severity: 'error',
      //   summary: 'Erro',
      //   detail: 'O valor da transação não pode ser zero ou negativo',
      // });

      return;
    }

    if (this.transaction().id) {
      // TODO: atualizar transação
    } else {
      // TODO: aqui estaria certo usar o uuid diretamente? Eu penso que isso é contra as regras do SOLID
      // TODO: criar transação
    }

    // this.transactions = [...this.transactions];
    this.newTransactionDialog = false;
    this.transaction.set(Transaction.reset());
  }

  deleteTransaction(transaction: Transaction) {
    this.createConfirmationDialog('Você tem certeza que deseja deletar a transação #' + transaction.id + '?', () => {
      // TODO: aqui não é mais o componente que aplica essa regra, e sim os serviços que criamos
      // this.transactions = this.transactions.filter((val) => val.id !== transaction.id);
      // this.transaction = {};
    });
  }

  deleteMultipleTransactions() {
    this.createConfirmationDialog('Você tem certeza que deseja deletar as transações selecionadas?', () => {
      // TODO: [MESMA COISA] aqui não é mais o componente que aplica essa regra, e sim os serviços que criamos
      // this.transactions = this.transactions.filter((val) => !this.selectedTransactions?.includes(val));
      // this.selectedTransactions = null;
    });
  }
}
