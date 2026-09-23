import { Routes } from '@angular/router';
import { FocusSanctuaryPage } from './features/tarea-enfoque/pages/focus-sanctuary.page';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent) },

  { 
    path: '', 
    loadComponent: () => import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', component: FocusSanctuaryPage }
    ]
  },
  { path: '**', redirectTo: '' }
];
