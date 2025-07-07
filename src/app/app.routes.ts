import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Home2Component } from './pages/home2/home2.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home2', component: Home2Component },

  // Lazy loading e carregamento assíncrono
  {
    path: 'transferencias',
    loadComponent: () =>
      import('./pages/transactions/transactions-page.component').then((m) => m.TransactionsPageComponent),
  },
];
