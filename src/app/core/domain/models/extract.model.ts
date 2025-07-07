import { Transaction } from './Transaction';

export interface Extract {
  transactions: Transaction[];

  totalIncome(): number;
  totalExpense(): number;
  balance(startDate?: Date, endDate?: Date): number; // Nota: se não enviar, retorna o saldo do mês atual
}
