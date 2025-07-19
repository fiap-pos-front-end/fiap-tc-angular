import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { CategoryDTO, emitEvent, EVENTS, Transaction, TransactionType } from '@fiap-pos-front-end/fiap-tc-shared';
import {
  DialogTransactionFormComponent,
  DialogUploaderComponent,
  TransactionsListHeaderToolbarComponent,
} from '@fiap-tc-angular/components';
import { CreateTransactionDTO, ManageTransactionsUseCaseService } from '@fiap-tc-angular/core/application';
import { TransactionService } from '@fiap-tc-angular/infrastructure';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Table } from 'primeng/table';
import { firstValueFrom } from 'rxjs';
import { PRIMENG_MODULES } from './imports';

interface Column {
  field: string;
  header: string;
}

interface TransactionDialogState {
  visible: boolean;
  isEditing: boolean;
}

interface UploaderDialogState {
  visible: boolean;
}

@Component({
  selector: 'app-transactions-list',
  imports: [
    CommonModule,
    DialogTransactionFormComponent,
    TransactionsListHeaderToolbarComponent,
    DialogUploaderComponent,
    ConfirmDialogModule,
    ...PRIMENG_MODULES,
  ],
  providers: [MessageService, ConfirmationService, ManageTransactionsUseCaseService, AsyncPipe],
  templateUrl: './transactions-list.component.html',
})
export class TransactionsListComponent implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly transactionService = inject(TransactionService);
  private readonly manageTransactionsUseCase = inject(ManageTransactionsUseCaseService);

  readonly categories = input.required<CategoryDTO[]>();

  @ViewChild('dt') dt!: Table;

  readonly cols = signal<Column[]>([]);
  readonly transactions = signal<Transaction[]>([]);
  readonly selectedTransactions = signal<Transaction[]>([]);
  readonly currentTransaction = signal<Transaction | undefined>(undefined);
  readonly dialogState = signal<TransactionDialogState>({ visible: false, isEditing: false });
  readonly dialogUploaderState = signal<UploaderDialogState>({ visible: false });

  ngOnInit() {
    this.initializeColumns();
    this.loadTransactions();
  }

  private initializeColumns(): void {
    this.cols.set([
      { field: 'type', header: 'Tipo' },
      { field: 'amount.value', header: 'Valor' },
      { field: 'category', header: 'Categoria' },
      { field: 'date', header: 'Data' },
    ]);
  }

  private loadTransactions(): void {
    this.transactionService.getAll().subscribe({
      next: (list) => {
        this.transactions.set(list.map((t) => Transaction.appendCategory(t, t.categoryId, this.categories())));
        emitEvent(EVENTS.TRANSACTIONS_UPDATED, this.transactions());
      },
      error: (error) => this.showErrorMessage('Erro ao carregar transações', error.message),
    });
  }

  private showErrorMessage(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 5000,
    });
  }

  private showSuccessMessage(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail,
      life: 3000,
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
        this.showSuccessMessage('Ação realizada com sucesso');
      },
    });
  }

  openNewTransactionDialog() {
    this.dialogState.set({ visible: true, isEditing: false });
  }

  hideTransactionDialog() {
    this.dialogState.set({ visible: false, isEditing: false });
    this.currentTransaction.set(undefined);
  }

  onSearchInput(event: Event) {
    this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onFiltersClear() {
    this.dt.clear();
  }

  onExportCsvClicked() {
    this.dt.exportCSV();
  }

  getTransactionTypeColor(type: TransactionType): string {
    const colors = {
      [TransactionType.INCOME]: 'success',
      [TransactionType.EXPENSE]: 'danger',
    };

    return colors[type] || 'info';
  }

  editTransaction(transaction: Transaction) {
    this.currentTransaction.set(transaction);
    this.dialogState.set({ visible: true, isEditing: true });
  }

  saveTransaction(transactionData: { id: string } & CreateTransactionDTO) {
    const dto: CreateTransactionDTO = { ...transactionData, amount: transactionData.amount };

    const operation = transactionData.id
      ? this.transactionService.update(transactionData.id, dto)
      : this.transactionService.create(dto);

    operation.subscribe({
      next: () => {
        this.loadTransactions();
        this.hideTransactionDialog();
        this.showSuccessMessage(`Transação ${transactionData.id ? 'atualizada' : 'criada'} com sucesso`);
        this.currentTransaction.set(undefined);
      },
      error: (error) => this.showErrorMessage('Erro ao salvar transação', error.message),
    });
  }

  deleteTransaction(transaction: Transaction) {
    this.buildAndDisplayConfirmationDialog(
      `Você tem certeza que deseja deletar a transação de ${transaction.amount.toString()} (${transaction.category}) do dia ${transaction.date.toLocaleDateString('pt-BR')}?`,
      () => {
        this.transactionService.delete(transaction.id).subscribe({
          next: () => this.loadTransactions(),
          error: (error) => this.showErrorMessage('Erro ao deletar transação', error.message),
        });
      },
    );
  }

  deleteMultipleTransactions() {
    const selectedTransactions = this.selectedTransactions();
    if (!selectedTransactions.length) return;

    this.buildAndDisplayConfirmationDialog('Você tem certeza que deseja deletar as transações selecionadas?', () => {
      Promise.all(
        selectedTransactions.map((transaction) => firstValueFrom(this.transactionService.delete(transaction.id))),
      )
        .then(() => {
          this.loadTransactions();
          this.selectedTransactions.set([]);
        })
        .catch((error) => {
          this.showErrorMessage('Erro ao deletar transações', error.message);
        });
    });
  }

  openUploadTransaction(transaction: Transaction) {
    this.dialogUploaderState.set({ visible: true });
  }

  hideUploadDialog() {
    this.dialogUploaderState.set({ visible: false });
  }
}
