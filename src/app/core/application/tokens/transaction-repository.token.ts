import { InjectionToken } from '@angular/core';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';

export const TRANSACTION_REPOSITORY = new InjectionToken<ITransactionRepository>('TRANSACTION_REPOSITORY');
