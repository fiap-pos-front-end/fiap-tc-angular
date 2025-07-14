import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';

type TransactionTypeSelectOption = {
  label: TransactionType;
  value: TransactionType;
};

enum TransactionField {
  AMOUNT = 'amount',
  DATE = 'date',
  TYPE = 'type',
  CATEGORY = 'category',
}

@Component({
  selector: 'app-transaction-form',
  imports: [DatePicker, InputNumber, InputTextModule, FormsModule, Select],
  templateUrl: './transaction-form.component.html',
})
export class TransactionFormComponent {
  transaction = input<Transaction>();

  transactionChange = output<Transaction>();

  readonly TransactionField: typeof TransactionField = TransactionField;

  amount = computed(() => this.transaction()?.amount.value ?? 0);
  date = computed(() => this.transaction()?.date ?? new Date());
  category = computed(() => this.transaction()?.category ?? '');
  type = computed(() => this.transaction()?.type ?? TransactionType.INCOME);

  readonly transactionTypes: Array<TransactionTypeSelectOption> = Object.entries(TransactionType).map(([_, label]) => ({
    label,
    value: label,
  }));

  updateField(field: TransactionField, value: any): void {
    const current = this.transaction();
    if (!current) return;

    const updatedTransaction = Transaction.create(
      current.id,
      field === TransactionField.TYPE ? value : current.type,
      field === TransactionField.AMOUNT ? value : current.amount.value,
      field === TransactionField.DATE ? value : current.date,
      field === TransactionField.CATEGORY ? value : current.category,
    );

    this.transactionChange.emit(updatedTransaction);
  }
}
