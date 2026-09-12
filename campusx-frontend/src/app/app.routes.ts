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
  // DASHBOARD
  // =========================

  {
    path: 'dashboard',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },


  // =========================
  // PROFILE
  // =========================

  {
    path: 'profile',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/profile/pages/profile/profile')
        .then(m => m.Profile)
  },


  // =========================
  // HOSTEL
  // =========================

  {
    path: 'hostel',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/hostel/pages/hostel/hostel')
        .then(m => m.HostelPage)
  },


  // =========================
  // LAB BOOKING
  // =========================

  {
    path: 'lab-booking',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/lab-booking/pages/lab-booking/lab-booking')
        .then(m => m.LabBookingPage)
  },


  // =========================
  // STUDENT EVENTS
  // =========================

  {
    path: 'events',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/student/events/events')
        .then(m => m.Events)
  },


  // =========================
  // STUDENT NOTIFICATIONS
  // =========================

  {
    path: 'notifications',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/notifications/pages/notifications/notifications')
        .then(m => m.Notifications)
  },


  // =========================
  // STUDENT COMPLAINTS
  // =========================

  {
    path: 'complaints',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/complaints/pages/complaints/complaints')
        .then(m => m.Complaints)
  },


  // =========================
  // STUDENT CERTIFICATES
  // =========================

  {
    path: 'certificates',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/certificates/pages/certificates/certificates')
        .then(m => m.Certificates)
  },


  // =========================
  // PAYMENTS
  // =========================

  {
    path: 'payments',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/payments/pages/payments/payments')
        .then(m => m.Payments)
  },


  // =========================
  // ADMIN - LAB MANAGEMENT
  // =========================

  {
    path: 'admin/labs',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/admin/lab-management/lab-management')
        .then(m => m.LabManagement)
  },


  // =========================
  // ADMIN - EVENT MANAGEMENT
  // =========================

  {
    path: 'admin/events',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/admin/event-management/event-management')
        .then(m => m.EventManagement)
  },


  // =========================
  // ADMIN - COMPLAINT MANAGEMENT
  // =========================

  {
    path: 'admin/complaints',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/admin/complaint-management/complaint-management')
        .then(m => m.ComplaintManagement)
  },


  // =========================
  // ADMIN - CERTIFICATE MANAGEMENT
  // =========================

  {
    path: 'admin/certificates',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/admin/certificate-management/certificate-management')
        .then(m => m.CertificateManagement)
  },


  // =========================
  // ADMIN - NOTIFICATION MANAGEMENT
  // =========================

  {
    path: 'admin/notifications',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/admin/notification-management/notification-management')
        .then(m => m.NotificationManagement)
  },


  // =========================
  // UNKNOWN URL → LOGIN
  // =========================

  {
    path: '**',
    redirectTo: 'login'
  }

];