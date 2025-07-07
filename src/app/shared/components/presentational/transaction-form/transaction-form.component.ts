import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-transaction-form',
  imports: [Button, InputNumber, FormsModule, Select],
  templateUrl: './transaction-form.component.html',
})
export class TransactionFormComponent {
  readonly transactionTypes: TransactionType[] = Object.values(TransactionType);

  submitted: boolean = false;
  transaction: WritableSignal<Transaction> = signal<Transaction>(
    Transaction.create('ID-FAKE', TransactionType.INCOME, 0, new Date(), 'CATEGORY-FAKE'),
  );

  hideDialog() {}

  saveTransaction() {}
}
