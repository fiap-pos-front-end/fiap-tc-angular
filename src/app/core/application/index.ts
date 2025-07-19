import { TransactionType } from '../domain';

export * from './tokens';

export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  category: number;
  date: Date;
}
