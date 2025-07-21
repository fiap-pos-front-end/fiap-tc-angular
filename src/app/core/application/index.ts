import { TransactionType } from '@fiap-pos-front-end/fiap-tc-shared';

export * from './tokens';

export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  category: number;
  date: Date;
}
