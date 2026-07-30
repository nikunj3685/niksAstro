import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./aladin/aladin').then((m) => m.Aladin)
  }
];
