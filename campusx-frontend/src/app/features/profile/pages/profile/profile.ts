import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { StudentProfile } from '../../../../core/models/auth';

@Component({
  selector: 'app-profile',
  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  // =========================
  // STUDENT
  // =========================

  student: StudentProfile | null = null;


  // =========================
  // NOTIFICATIONS
  // =========================

  unreadCount = 0;


  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================
  // INITIAL LOAD
  // =========================

  ngOnInit(): void {

    this.loadStudentProfile();

    this.loadUnreadNotificationCount();

  }


  // =========================
  // LOAD PROFILE
  // =========================

  loadStudentProfile(): void {

    console.log(
      'Loading student profile...'
    );


    this.authService
      .getCurrentStudent()
      .subscribe({

        next: (
          data: StudentProfile
        ) => {

          console.log(
            'Profile data received:',
            data
          );


          this.student = data;


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load profile:',
            error
          );


          // Unauthorized

          if (
            error.status === 401
          ) {

            this.authService.logout();

            this.router.navigate([
              '/login'
            ]);

          }

        }

      });

  }


  // =========================
  // LOAD UNREAD NOTIFICATIONS
  // =========================

  loadUnreadNotificationCount(): void {

    const storedStudentId =
      localStorage.getItem('studentId');


    console.log(
      'Profile notification Student ID:',
      storedStudentId
    );


    if (!storedStudentId) {

      this.unreadCount = 0;

      this.cdr.detectChanges();

      return;

    }


    const studentId =
      Number(storedStudentId);


    if (!studentId) {

      this.unreadCount = 0;

      this.cdr.detectChanges();

      return;

    }


    this.notificationService
      .getMyNotifications(studentId)
      .subscribe({

        next: (notifications) => {

          if (!Array.isArray(notifications)) {

            this.unreadCount = 0;

            this.cdr.detectChanges();

            return;

          }


          this.unreadCount =
            notifications.filter(
              notification =>
                !notification.isRead
            ).length;


          console.log(
            'Profile unread notifications:',
            this.unreadCount
          );


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load Profile notification count:',
            error
          );


          this.unreadCount = 0;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // GO TO DASHBOARD
  // =========================

  goToDashboard(): void {

    this.router.navigate([
      '/dashboard'
    ]);

  }


  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}