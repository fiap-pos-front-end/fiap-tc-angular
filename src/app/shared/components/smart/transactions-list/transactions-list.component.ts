import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ManageTransactionsUseCaseService } from '@fiap-tc-angular/core/application';
import { Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { inMemoryTransactionProvider } from '@fiap-tc-angular/infrastructure';
import { ProductService } from '@fiap-tc-angular/services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { Product } from '../../../models';
import { ImportsModule } from './imports';

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
  imports: [ImportsModule, CommonModule],
  providers: [
    MessageService,
    ConfirmationService,
    ManageTransactionsUseCaseService,
    ProductService,
    inMemoryTransactionProvider,
    AsyncPipe,
  ],
  templateUrl: './transactions-list.component.html',
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
})
export class TransactionsListComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private productService = inject(ProductService); // TODO: Remover porque foi MVP
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private manageTransactionsUseCase = inject(ManageTransactionsUseCaseService);

  readonly transactionTypes: TransactionType[] = Object.values(TransactionType);

  newTransactionDialog: boolean = false;
  selectedTransactions: Transaction[] = [];
  transaction!: Transaction;
  transactions$: Observable<Transaction[]> = new Observable<Transaction[]>();

  // ---- Começar revisão daqui ----

  products!: Product[];

  product!: Product;

  selectedProducts!: Product[] | null;

  submitted: boolean = false;

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  exportColumns!: ExportColumn[];
  // ---- Acabar revisão aqui ----

  ngOnInit() {
    this.loadTransactions();
    this.loadDemoData();
  }

  private loadTransactions(): void {
    this.transactions$ = this.manageTransactionsUseCase.getAllTransactions();
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadDemoData() {
    this.productService.getProducts().then((data) => {
      this.products = data;
      this.cdr.markForCheck();
    });

    this.cols = [
      { field: 'id', header: '#', customExportHeader: 'ID da Transação' },
      { field: 'type', header: 'Tipo' },
      { field: 'date', header: 'Data' },
      { field: 'amount', header: 'Valor' },
      { field: 'category', header: 'Categoria' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.newTransactionDialog = true;
  }

  editTransaction(product: Product) {
    this.product = { ...product };
    this.newTransactionDialog = true;
  }

  deleteSelectedProducts() {
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

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Transações Deletadas',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.newTransactionDialog = false;
    this.submitted = false;
  }

  deleteTransaction(transaction: Transaction) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja deletar a transação #' + transaction.id + '?',
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
        // TODO: aqui não é mais o componente que aplica essa regra, e sim os serviços que criamos
        // this.transactions = this.transactions.filter((val) => val.id !== transaction.id);
        // this.transaction = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Transação Deletada',
          life: 3000,
        });
      },
    });
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
