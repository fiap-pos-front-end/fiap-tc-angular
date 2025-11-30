import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  emitEvent,
  EVENTS,
  Transaction as TransactionShared,
  TransactionType,
} from '@fiap-pos-front-end/fiap-tc-shared';
import { Transaction } from '@fiap-tc-angular/domain/entities/Transaction';
import { CreateTransactionUseCase } from '@fiap-tc-angular/domain/usecases/CreateTransactionUseCase';
import { DeleteTransactionUseCase } from '@fiap-tc-angular/domain/usecases/DeleteTransactionUseCase';
import { GetAllTransactionsUseCase } from '@fiap-tc-angular/domain/usecases/GetAllTransactionsUseCase';
import { UpdateTransactionUseCase } from '@fiap-tc-angular/domain/usecases/UpdateTransactionUseCase';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { firstValueFrom } from 'rxjs';
import {
  DialogTransactionFormComponent,
  DialogUploaderComponent,
  TransactionsListHeaderToolbarComponent,
} from '../../presentational';
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
    ...PRIMENG_MODULES,
  ],
  providers: [MessageService, ConfirmationService, AsyncPipe],
  templateUrl: './transactions-list.component.html',
})
export class TransactionsListComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  private readonly getAllTransactionsUseCase = inject(GetAllTransactionsUseCase);
  private readonly createTransactionUseCase = inject(CreateTransactionUseCase);
  private readonly updateTransactionUseCase = inject(UpdateTransactionUseCase);
  private readonly deleteTransactionUseCase = inject(DeleteTransactionUseCase);

  @ViewChild('dt') dt!: Table;

  readonly cols = signal<Column[]>([]);
  readonly transactions = signal<Transaction[]>([]);
  readonly selectedTransactions = signal<TransactionShared[]>([]);
  readonly currentTransaction = signal<TransactionShared | undefined>(undefined);
  readonly dialogState = signal<TransactionDialogState>({ visible: false, isEditing: false });
  readonly dialogUploaderState = signal<UploaderDialogState>({ visible: false });

  ngOnInit() {
    this.initializeColumns();
    this.loadTransactions();
  }

  private initializeColumns(): void {
    this.cols.set([
      { field: 'type', header: 'Tipo' },
      { field: 'amount', header: 'Valor' },
      { field: 'category.name', header: 'Categoria' },
      { field: 'date', header: 'Data' },
    ]);
  }

  private loadTransactions(): void {
    this.getAllTransactionsUseCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.transactions.set(list);
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
      [TransactionType.RECEITA]: 'success',
      [TransactionType.DESPESA]: 'danger',
    };

    return colors[type] || 'info';
  }

  saveTransaction(transaction: TransactionShared) {
    const operation = transaction.id
      ? this.updateTransactionUseCase.execute(transaction.id, transaction)
      : this.createTransactionUseCase.execute(transaction);

    operation.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loadTransactions();
        this.hideTransactionDialog();
        this.showSuccessMessage(`Transação ${transaction.id ? 'atualizada' : 'criada'} com sucesso`);
        this.currentTransaction.set(undefined);
      },
      error: (error) => this.showErrorMessage('Erro ao salvar transação', error.message),
    });
  }

  editTransaction(transaction: TransactionShared) {
    this.currentTransaction.set(transaction);
    this.dialogState.set({ visible: true, isEditing: true });
  }

  deleteTransaction(transaction: TransactionShared) {
    this.buildAndDisplayConfirmationDialog(
      `Você tem certeza que deseja deletar a transação de ${transaction.amount.toString()} (${transaction.category?.name}) do dia ${new Date(transaction.date).toLocaleDateString('pt-BR')}?`,
      () => {
        this.deleteTransactionUseCase
          .execute(transaction.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
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
        selectedTransactions.map((transaction) =>
          firstValueFrom(this.deleteTransactionUseCase.execute(transaction.id)),
        ),
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

  openUploadTransaction(transaction: TransactionShared) {
    this.dialogUploaderState.set({ visible: true });
    this.currentTransaction.set(transaction);
  }

  hideUploadDialog() {
    this.dialogUploaderState.set({ visible: false });
    this.currentTransaction.set(undefined);
  }

  saveUpload(typeMessage: number) {
    this.hideUploadDialog();
    switch (typeMessage) {
      case 1:
        this.showSuccessMessage('Upload realizado com sucesso');
        break;

      case 2:
        this.showSuccessMessage('Anexos removidos com sucesso');
        break;
    }
  }
}
