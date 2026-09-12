import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  // =====================================================
  // DEFAULT
  // =====================================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // =====================================================
  // AUTH
  // =====================================================

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login')
        .then(m => m.Login)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register')
        .then(m => m.Register)
  },


  // =====================================================
  // STUDENT DASHBOARD
  // =====================================================

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },


  // =====================================================
  // STUDENT PROFILE
  // =====================================================

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/pages/profile/profile')
        .then(m => m.Profile)
  },


  // =====================================================
  // STUDENT HOSTEL
  // =====================================================

  {
    path: 'hostel',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/hostel/pages/hostel/hostel')
        .then(m => m.HostelPage)
  },


  // =====================================================
  // STUDENT LAB BOOKING
  // =====================================================

  {
    path: 'lab-booking',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/lab-booking/pages/lab-booking/lab-booking')
        .then(m => m.LabBookingPage)
  },


  // =====================================================
  // STUDENT LABS
  // =====================================================

  {
    path: 'labs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/labs/pages/labs/labs')
        .then(m => m.Labs)
  },


  // =====================================================
  // STUDENT NOTIFICATIONS
  // =====================================================

  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/notifications/pages/notifications/notifications')
        .then(m => m.Notifications)
  },


  // =====================================================
  // STUDENT COMPLAINTS
  // =====================================================

  {
    path: 'complaints',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/complaints/pages/complaints/complaints')
        .then(m => m.Complaints)
  },


  // =====================================================
  // STUDENT CERTIFICATES
  // =====================================================

  {
    path: 'certificates',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/certificates/pages/certificates/certificates')
        .then(m => m.Certificates)
  },


  // =====================================================
  // STUDENT PAYMENTS
  // =====================================================

  {
    path: 'payments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/payments/pages/payments/payments')
        .then(m => m.Payments)
  },


  // =====================================================
  // ADMIN
  // =====================================================

  {
    path: 'admin',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/admin/layout/admin-layout/admin-layout')
        .then(m => m.AdminLayout),

    children: [

      // =================================================
      // ADMIN DEFAULT
      // =================================================

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },


      // =================================================
      // ADMIN DASHBOARD
      // =================================================

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/pages/admin-dashboard/admin-dashboard')
            .then(m => m.AdminDashboard)
      },


      // =================================================
      // ADMIN STUDENTS
      // =================================================

      {
        path: 'students',
        loadComponent: () =>
          import('./features/admin/pages/admin-students/admin-students')
            .then(m => m.AdminStudents)
      },


      // =================================================
      // ADMIN HOSTELS
      // =================================================

      {
        path: 'hostels',
        loadComponent: () =>
          import('./features/admin/pages/admin-hostels/admin-hostels')
            .then(m => m.AdminHostels)
      },


      // =================================================
      // ADMIN FEES
      // =================================================

      {
        path: 'fees',
        loadComponent: () =>
          import('./features/admin/pages/admin-fees/admin-fees')
            .then(m => m.AdminFees)
      },


      // =================================================
      // ADMIN LABS
      // =================================================

      {
        path: 'labs',
        loadComponent: () =>
          import('./features/admin/pages/admin-labs/admin-labs')
            .then(m => m.AdminLabs)
      },


      // =================================================
      // ADMIN EVENTS
      // =================================================

      {
        path: 'events',
        loadComponent: () =>
          import('./features/admin/pages/admin-events/admin-events')
            .then(m => m.AdminEvents)
      },


      // =================================================
      // ADMIN COMPLAINTS
      // =================================================

      {
        path: 'complaints',
        loadComponent: () =>
          import('./features/admin/pages/admin-complaints/admin-complaints')
            .then(m => m.AdminComplaints)
      },


      // =================================================
      // ADMIN CERTIFICATES
      // =================================================

      {
        path: 'certificates',
        loadComponent: () =>
          import('./features/admin/pages/admin-certificates/admin-certificates')
            .then(m => m.AdminCertificates)
      },


      // =================================================
      // ADMIN NOTIFICATIONS
      // =================================================

      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/admin/pages/admin-notifications/admin-notifications')
            .then(m => m.AdminNotifications)
      }

    ]
  },


  // =====================================================
  // FALLBACK
  // =====================================================

  {
    path: '**',
    redirectTo: 'login'
  }

];