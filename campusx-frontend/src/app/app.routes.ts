import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  // =========================
  // DEFAULT → LOGIN
  // =========================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // =========================
  // LOGIN
  // =========================

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login')
        .then(m => m.Login)
  },


  // =========================
  // REGISTER
  // =========================

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register')
        .then(m => m.Register)
  },


  // =========================
  // DASHBOARD - PROTECTED
  // =========================

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },


  // =========================
  // PROFILE - PROTECTED
  // =========================

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/pages/profile/profile')
        .then(m => m.Profile)
  },


  // =========================
  // HOSTEL - PROTECTED
  // =========================

  {
    path: 'hostel',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/hostel/pages/hostel/hostel')
        .then(m => m.HostelPage)
  },


  // =========================
  // UNKNOWN URL → LOGIN
  // =========================

  {
    path: '**',
    redirectTo: 'login'
  }

];