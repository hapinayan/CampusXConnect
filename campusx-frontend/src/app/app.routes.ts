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
  // LAB BOOKING - PROTECTED
  // =========================

  {
    path: 'lab-booking',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/lab-booking/pages/lab-booking/lab-booking')
        .then(m => m.LabBookingPage)
  },


  // =========================
  // EVENTS - PROTECTED
  // =========================

  {
    path: 'events',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/student/events/events')
        .then(m => m.Events)
  },


  // =========================
  // NOTIFICATIONS - PROTECTED
  // =========================

  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/notifications/pages/notifications/notifications')
        .then(m => m.Notifications)
  },


  // =========================
  // COMPLAINTS - PROTECTED
  // =========================

  {
    path: 'complaints',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/complaints/pages/complaints/complaints')
        .then(m => m.Complaints)
  },


  // =========================
  // CERTIFICATES - PROTECTED
  // =========================

  {
    path: 'certificates',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/certificates/pages/certificates/certificates')
        .then(m => m.Certificates)
  },


  // =========================
  // PAYMENTS - PROTECTED
  // =========================

  {
    path: 'payments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/payments/pages/payments/payments')
        .then(m => m.Payments)
  },


  // =========================
  // UNKNOWN URL → LOGIN
  // =========================

  {
    path: '**',
    redirectTo: 'login'
  }

];