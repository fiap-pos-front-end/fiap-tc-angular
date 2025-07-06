import { TransactionType } from './TransactionType';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: Date;
  category: string;
}
