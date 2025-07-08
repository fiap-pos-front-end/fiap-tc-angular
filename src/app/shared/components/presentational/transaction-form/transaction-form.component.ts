import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-transaction-form',
  imports: [DatePicker, InputNumber, InputTextModule, FormsModule, Select],
  templateUrl: './transaction-form.component.html',
})
export class TransactionFormComponent {
  transaction: WritableSignal<Transaction> = signal<Transaction>(Transaction.reset());
  selectedTransactionType: TransactionType | undefined;

  readonly transactionTypes: Array<{ label: TransactionType; value: string }> = Object.entries(TransactionType).map(
    ([value, label]) => ({ label, value }),
  );

  hideDialog() {}

  saveTransaction() {}
}
