import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { emitEvent, EVENTS, Transaction, TransactionType } from '@fiap-pos-front-end/fiap-tc-shared';
import {
  DialogTransactionFormComponent,
  DialogUploaderComponent,
  TransactionsListHeaderToolbarComponent,
} from '@fiap-tc-angular/components';
import { TransactionService } from '@fiap-tc-angular/infrastructure';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { firstValueFrom } from 'rxjs';
import { PRIMENG_MODULES } from './imports';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly transactionService = inject(TransactionService);

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
      { field: 'amount', header: 'Valor' },
      { field: 'category.name', header: 'Categoria' },
      { field: 'date', header: 'Data' },
    ]);
  }

  private loadTransactions(): void {
    this.transactionService
      .getAll()
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

  editTransaction(transaction: Transaction) {
    this.currentTransaction.set(transaction);
    this.dialogState.set({ visible: true, isEditing: true });
  }

  saveTransaction(transaction: Transaction) {
    const operation = transaction.id
      ? this.transactionService.update(Number(transaction.id), transaction)
      : this.transactionService.create(transaction);

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

  deleteTransaction(transaction: Transaction) {
    this.buildAndDisplayConfirmationDialog(
      `Você tem certeza que deseja deletar a transação de ${transaction.amount.toString()} (${transaction.category}) do dia ${transaction.date.toLocaleDateString('pt-BR')}?`,
      () => {
        this.transactionService
          .delete(transaction.id)
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
