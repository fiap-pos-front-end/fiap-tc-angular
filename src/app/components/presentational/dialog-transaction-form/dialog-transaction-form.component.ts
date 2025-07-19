import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction, TransactionType } from '@fiap-tc-angular/core/domain';
import { Category } from '@fiap-tc-angular/infrastructure';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';

type TransactionTypeSelectOption = {
  label: TransactionType;
  value: TransactionType;
};

@Component({
  selector: 'app-dialog-transaction-form',
  imports: [
    DatePicker,
    Dialog,
    InputNumber,
    Button,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    Message,
    Select,
    ConfirmDialogModule,
  ],
  templateUrl: './dialog-transaction-form.component.html',
})
export class DialogTransactionFormComponent {
  readonly categories = input.required<Category[]>();
  readonly isEditing = input<boolean>(false);
  readonly isVisible = input.required<boolean>();
  readonly transactionToBeUpdated = input<Transaction | undefined>(undefined);
  readonly onHide = output<void>();
  readonly onSave = output<Transaction>();

  constructor() {
    effect(() => {
      if (this.transactionToBeUpdated()) {
        this.transactionForm.patchValue({
          ...this.transactionToBeUpdated()!,
          amount: this.transactionToBeUpdated()!.amount.value,
          category: this.categories().find((c) => c.id.toString() === this.transactionToBeUpdated()!.categoryId)?.id,
        });

        this.transactionForm.updateValueAndValidity();
      }
    });
  }

  readonly formSubmitted = signal<boolean>(false);
  readonly dialogTitle = computed(() => (this.isEditing() ? 'Editar transação' : 'Nova transação'));

  readonly amountInvalid = this.createControlValidation('amount');
  readonly dateInvalid = this.createControlValidation('date');
  readonly typeInvalid = this.createControlValidation('type');
  readonly categoryInvalid = this.createControlValidation('category');
  readonly transactionTypes: Array<TransactionTypeSelectOption> = Object.entries(TransactionType).map(([_, label]) => ({
    label,
    value: label,
  }));

  readonly transactionForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    date: new FormControl(new Date(), [Validators.required]),
    category: new FormControl('', [Validators.required]),
    type: new FormControl(TransactionType.INCOME, [Validators.required]),
  });

  private createControlValidation(controlName: string) {
    return computed(() => {
      const control = this.transactionForm.get(controlName);
      return control?.invalid && (control.touched || this.formSubmitted());
    });
  }

  saveTransaction() {
    this.formSubmitted.set(true);

    if (this.transactionForm.valid) {
      this.onSave.emit(this.transactionForm.value);
      this.transactionForm.reset();
      this.formSubmitted.set(false);
    } else {
      console.log('## CL ## Inválido!');
      // TODO: vamos exibir um toast de erro aqui também?
    }
  }
}
