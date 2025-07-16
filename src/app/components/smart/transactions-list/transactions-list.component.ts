import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { DialogTransactionFormComponent, TransactionsListHeaderToolbarComponent } from '@fiap-tc-angular/components';
import { CreateTransactionDTO, ManageTransactionsUseCaseService } from '@fiap-tc-angular/core/application';
import { Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Table } from 'primeng/table';
import { firstValueFrom } from 'rxjs';
import { PRIMENG_MODULES } from './imports';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface TransactionDialogState {
  visible: boolean;
  isEditing: boolean;
}

@Component({
  selector: 'app-transactions-list',
  imports: [
    CommonModule,
    DialogTransactionFormComponent,
    TransactionsListHeaderToolbarComponent,
    ConfirmDialogModule,
    ConfirmPopupModule,
    ...PRIMENG_MODULES,
  ],
  providers: [MessageService, ConfirmationService, ManageTransactionsUseCaseService, AsyncPipe],
  templateUrl: './transactions-list.component.html',
})
export class TransactionsListComponent implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly manageTransactionsUseCase = inject(ManageTransactionsUseCaseService);

  @ViewChild('dt') dt!: Table;

  readonly cols = signal<Column[]>([]);
  readonly transactions = signal<Transaction[]>([]);
  readonly selectedTransactions = signal<Transaction[]>([]);
  readonly currentTransaction = signal<Transaction | undefined>(undefined);
  readonly dialogState = signal<TransactionDialogState>({ visible: false, isEditing: false });

  ngOnInit() {
    this.initializeColumns();
    this.loadTransactions();
  }

  private initializeColumns(): void {
    this.cols.set([
      { field: 'id', header: '#', customExportHeader: 'ID da Transação' },
      { field: 'type', header: 'Tipo' },
      { field: 'amount', header: 'Valor' },
      { field: 'category', header: 'Categoria' },
      { field: 'date', header: 'Data' },
    ]);
  }

  private loadTransactions(): void {
    this.manageTransactionsUseCase.getAllTransactions().subscribe({
      next: (list) => this.transactions.set(list),
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
      ? this.manageTransactionsUseCase.updateTransaction(transactionData.id, dto)
      : this.manageTransactionsUseCase.createTransaction(dto);

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
        this.manageTransactionsUseCase.deleteTransaction(transaction.id).subscribe({
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
          firstValueFrom(this.manageTransactionsUseCase.deleteTransaction(transaction.id)),
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
}
