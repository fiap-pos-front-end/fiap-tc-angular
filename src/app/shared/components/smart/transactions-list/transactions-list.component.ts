import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import {
  CreateTransactionUseCase,
  DeleteTransactionUseCase,
  ID_GENERATOR_TOKEN,
  ManageTransactionsUseCaseService,
  TRANSACTION_REPOSITORY_TOKEN,
} from '@fiap-tc-angular/core/application';
import { Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { InMemoryTransactionRepository, UuidGeneratorRepository } from '@fiap-tc-angular/infrastructure';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Table } from 'primeng/table';
import { TransactionFormComponent } from '../../presentational/transaction-form/transaction-form.component';
import { PRIMENG_MODULES } from './imports';
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
    CommonModule,
    TransactionsListHeaderToolbarComponent,
    TransactionFormComponent,
    ConfirmDialogModule,
    ConfirmPopupModule,
    ...PRIMENG_MODULES,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    ManageTransactionsUseCaseService,
    AsyncPipe,
    // MVP
    // inMemoryTransactionProvider, // TODO: Queria injetar direto no app.config.ts, mas não está funcionando (aí mudaríamos apenas lá)
    // uuidGeneratorProvider, // TODO: Queria injetar direto no app.config.ts, mas não está funcionando (aí mudaríamos apenas lá)
    // InMemoryTransactionRepository,
    // UuidGeneratorRepository,
    // {
    //   provide: CreateTransactionUseCase,
    //   useFactory: (repo: InMemoryTransactionRepository, idGen: UuidGeneratorRepository) =>
    //     new CreateTransactionUseCase(repo, idGen),
    //   deps: [InMemoryTransactionRepository, UuidGeneratorRepository],
    // },

    // ✅ Injeta o repositório como singleton
    {
      provide: TRANSACTION_REPOSITORY_TOKEN,
      useClass: InMemoryTransactionRepository,
    },

    {
      provide: ID_GENERATOR_TOKEN,
      useClass: UuidGeneratorRepository,
    },

    // ✅ Injeta o use case usando os tokens corretos
    {
      provide: CreateTransactionUseCase,
      useFactory: (repo: InMemoryTransactionRepository, idGen: UuidGeneratorRepository) =>
        new CreateTransactionUseCase(repo, idGen),
      deps: [TRANSACTION_REPOSITORY_TOKEN, ID_GENERATOR_TOKEN],
    },
    {
      provide: DeleteTransactionUseCase,
      useFactory: (repo: InMemoryTransactionRepository) => new DeleteTransactionUseCase(repo),
      deps: [TRANSACTION_REPOSITORY_TOKEN],
    },
  ],
  templateUrl: './transactions-list.component.html',
})
export class TransactionsListComponent implements OnInit {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private manageTransactionsUseCase = inject(ManageTransactionsUseCaseService);
  private createTransactionUseCase = inject(CreateTransactionUseCase);
  private deleteTransactionUseCase = inject(DeleteTransactionUseCase);

  // TODO: Transformar em Signals
  submitted: boolean = false;
  newTransactionDialog: boolean = false;
  cols!: Column[];
  exportColumns!: ExportColumn[];
  @ViewChild('dt') dt!: Table;
  selectedTransactions: Transaction[] = [];
  transactions = signal<Transaction[]>([]);

  // TODO: Com certeza vou ter que melhorar isso para ser um DTO ou algo do tipo, e evitar ter que usar o create aqui. Isso tá errado.
  transaction: WritableSignal<Transaction | undefined> = signal<Transaction | undefined>(
    Transaction.create('1', TransactionType.INCOME, 100, new Date(), 'Salário'),
  );

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
    this.manageTransactionsUseCase.getAllTransactions().subscribe((list) => {
      this.transactions.set(list);
    });
  }

  private buildAndDisplayConfirmationDialog(message: string, onAccept: () => void) {
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
    // this.transaction.set(Transaction.reset());
    this.newTransactionDialog = true;
  }

  hideNewTransactionDialog() {
    this.newTransactionDialog = false;
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

  onTransactionChange(updatedTransaction: Transaction) {
    this.transaction.set(updatedTransaction);
  }

  editTransaction(transaction: Transaction) {
    // TODO: corrigir a exibição do tipo da transação no form
    this.transaction.set(transaction);
    this.newTransactionDialog = true;
  }

  saveTransaction() {
    this.submitted = true;

    const transaction = this.transaction();
    if (!transaction) return;

    // TODO: quando adicionar validações nos forms, talvez eu tire daqui ou deixe algo mais genérico
    if (transaction.amount.value <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'O valor da transação não pode ser zero ou negativo',
      });

      return;
    }

    this.createTransactionUseCase
      .execute({
        category: transaction.category,
        amount: transaction.amount.value,
        date: transaction.date,
        type: transaction.type,
      })
      .subscribe((transaction) => {
        console.log('## CL ## nova transação', transaction);
        this.loadTransactions();
      });

    if (this.transaction()?.id) {
      // TODO: atualizar transação
    } else {
      // TODO: aqui estaria certo usar o uuid diretamente? Eu penso que isso é contra as regras do SOLID
      // TODO: criar transação
    }

    // this.transactions = [...this.transactions];
    this.newTransactionDialog = false;
    // this.transaction.set(Transaction.reset());
  }

  deleteTransaction(transaction: Transaction) {
    this.buildAndDisplayConfirmationDialog(
      'Você tem certeza que deseja deletar a transação #' + transaction.id + '?',
      () => {
        this.deleteTransactionUseCase.execute(transaction.id).subscribe(() => {
          this.loadTransactions();
        });
        // this.transactions = this.transactions.filter((val) => val.id !== transaction.id);
        // this.transaction = {};
      },
    );
  }

  deleteMultipleTransactions() {
    this.buildAndDisplayConfirmationDialog('Você tem certeza que deseja deletar as transações selecionadas?', () => {
      // TODO: [MESMA COISA] aqui não é mais o componente que aplica essa regra, e sim os serviços que criamos
      // this.transactions = this.transactions.filter((val) => !this.selectedTransactions?.includes(val));
      // this.selectedTransactions = null;
    });
  }
}
