import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';

type TransactionTypeSelectOption = {
  label: TransactionType | undefined;
  value: string | undefined;
};

@Component({
  selector: 'app-transaction-form',
  imports: [DatePicker, InputNumber, InputTextModule, FormsModule, Select],
  templateUrl: './transaction-form.component.html',
})
export class TransactionFormComponent {
  transaction: InputSignal<Transaction> = input<Transaction>(Transaction.reset());

  readonly transactionTypes: Array<TransactionTypeSelectOption> = Object.entries(TransactionType).map(
    ([value, label]) => ({ label, value }),
  );

  selectedTransactionType: Signal<TransactionTypeSelectOption | undefined> = computed(() => {
    const selectedTransactionType = this.transactionTypes.find((type) => type.label === this.transaction().type);

    return {
      label: selectedTransactionType?.label,
      value: selectedTransactionType?.value,
    };
  });
}
