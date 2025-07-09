import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/transactions/transactions-page.component').then((m) => m.TransactionsPageComponent),
  },
];
