import { Injectable } from '@angular/core';
import { Money } from '../models/money.model';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  public calculateBalance(transactions: Transaction[]): Money {
    return transactions.reduce((balance, transaction) => {
      return balance.add(transaction.getSignedAmount());
    }, Money.from(0));
  }

  public calculateIncomes(transactions: Transaction[]): Money {
    return transactions
      .filter((t) => t.isIncome())
      .reduce((total, t) => total.add(t.amount), Money.from(0));
  }

  public calculateExpenses(transactions: Transaction[]): Money {
    return transactions
      .filter((t) => t.isExpense())
      .reduce((total, t) => total.add(t.amount), Money.from(0));
  }

  public getBalanceByPeriod(
    transactions: Transaction[],
    startDate: Date,
    endDate: Date
  ): Money {
    const filteredTransactions = transactions.filter((t) => {
      const transactionDate = t.date;
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    return this.calculateBalance(filteredTransactions);
  }
}
