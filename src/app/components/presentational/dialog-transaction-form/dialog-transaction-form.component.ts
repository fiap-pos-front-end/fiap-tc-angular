import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, Transaction, TransactionType } from '@fiap-pos-front-end/fiap-tc-shared';
import { CategoryService } from '@fiap-tc-angular/infrastructure';
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
export class DialogTransactionFormComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  readonly isEditing = input<boolean>(false);
  readonly isVisible = input.required<boolean>();
  readonly transactionToBeUpdated = input<Transaction | undefined>(undefined);
  readonly onHide = output<void>();
  readonly onSave = output<Transaction>();
  readonly categories = signal<Category[]>([]);

  effect = effect(() => {
    if (this.transactionToBeUpdated()) {
      this.transactionForm.patchValue({
        ...this.transactionToBeUpdated()!,
        date: new Date(this.transactionToBeUpdated()!.date),
      });
      this.transactionForm.updateValueAndValidity();
    }
  });

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((res) => {
      this.categories.set(res);
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
    amount: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    date: new FormControl(new Date(), [Validators.required]),
    categoryId: new FormControl('', [Validators.required]),
    type: new FormControl(TransactionType.RECEITA, [Validators.required]),
  });

  private createControlValidation(controlName: string) {
    return computed(() => {
      const control = this.transactionForm.get(controlName);
      return control?.invalid && (control.touched || this.formSubmitted());
    });
  }

  private resetForm() {
    this.transactionForm.reset();
    this.transactionForm.patchValue({ amount: null, date: new Date() });
    this.formSubmitted.set(false);
  }

  hideDialog() {
    this.resetForm();
    this.onHide.emit();
  }

  saveTransaction() {
    this.formSubmitted.set(true);

    if (!this.transactionForm.valid) {
      return;
    }

    this.onSave.emit(this.transactionForm.value);
    this.resetForm();
  }
}
