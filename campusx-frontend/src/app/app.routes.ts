import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

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

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/pages/profile/profile')
        .then(m => m.Profile)
  },

  {
    path: 'hostel',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/hostel/pages/hostel/hostel')
        .then(m => m.HostelPage)
  },

  {
    path: 'lab-booking',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/lab-booking/pages/lab-booking/lab-booking')
        .then(m => m.LabBookingPage)
  },

  {
    path: 'events',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/student/events/events')
        .then(m => m.Events)
  },

  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/notifications/pages/notifications/notifications')
        .then(m => m.Notifications)
  },

  {
    path: 'complaints',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/complaints/pages/complaints/complaints')
        .then(m => m.Complaints)
  },

  {
    path: 'certificates',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/certificates/pages/certificates/certificates')
        .then(m => m.Certificates)
  },

  {
    path: 'payments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/payments/pages/payments/payments')
        .then(m => m.Payments)
  },


  // =====================================================
  // ADMIN ROUTES
  // =====================================================

  {
    path: 'admin',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/admin/layout/admin-layout/admin-layout')
        .then(m => m.AdminLayout),

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/pages/admin-dashboard/admin-dashboard')
            .then(m => m.AdminDashboard)
      },

      {
        path: 'students',
        loadComponent: () =>
          import('./features/admin/pages/admin-students/admin-students')
            .then(m => m.AdminStudents)
      },

      {
        path: 'labs',
        loadComponent: () =>
          import('./features/admin/pages/admin-labs/admin-labs')
            .then(m => m.AdminLabs)
      },

      {
        path: 'events',
        loadComponent: () =>
          import('./features/admin/pages/admin-events/admin-events')
            .then(m => m.AdminEvents)
      },

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