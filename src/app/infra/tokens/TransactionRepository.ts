import { InjectionToken } from '@angular/core';
import { TransactionRepository } from '@fiap-tc-angular/domain/repositories/TransactionRepository';

export const TRANSACTION_REPOSITORY_TOKEN = new InjectionToken<TransactionRepository>('TRANSACTION_REPOSITORY_TOKEN');
