import { InjectionToken } from '@angular/core';
import { ITransactionRepository } from '@fiap-tc-angular/core/domain';

export const TRANSACTION_REPOSITORY_TOKEN = new InjectionToken<ITransactionRepository>('TRANSACTION_REPOSITORY_TOKEN');
