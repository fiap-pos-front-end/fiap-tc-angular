import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ManageTransactionsUseCaseService } from '@fiap-tc-angular/core/application';
import { Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { inMemoryTransactionProvider } from '@fiap-tc-angular/infrastructure';
import { ProductService } from '@fiap-tc-angular/services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { Product } from '../../../models';
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
    ProductService,
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
  transaction!: Transaction;
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
    this.transaction = Transaction.reset();
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

  // ---- Começar revisão daqui ----

  products!: Product[];

  product!: Product;

  selectedProducts!: Product[] | null;

  // ---- Acabar revisão aqui ----

  editTransaction(product: Product) {
    this.product = { ...product };
    this.newTransactionDialog = true;
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  saveTransaction() {
    this.submitted = true;

    if (this.product.name?.trim()) {
      if (this.product.id) {
        this.products[this.findIndexById(this.product.id)] = this.product;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      } else {
        // TODO: aqui estaria certo usar o uuid diretamente?
        this.product.id = this.createId();
        this.product.image = 'product-placeholder.svg';
        this.products.push(this.product);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000,
        });
      }

      this.products = [...this.products];
      this.newTransactionDialog = false;
      this.product = {};
    }
  }
}
