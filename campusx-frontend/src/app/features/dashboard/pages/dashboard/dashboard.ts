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

import {
  StudentProfile
} from '../../../../core/models/auth';


@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {


  // =====================================================
  // STUDENT PROFILE
  // =====================================================

  student: StudentProfile | null = null;



  // =====================================================
  // NOTIFICATION COUNT
  // =====================================================

  unreadCount = 0;



  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}



  // =====================================================
  // INITIAL LOAD
  // =====================================================

  ngOnInit(): void {

    console.log(
      'Dashboard initialized'
    );


    this.loadStudentProfile();

    this.loadUnreadNotificationCount();

  }



  // =====================================================
  // LOAD STUDENT PROFILE
  // =====================================================

  loadStudentProfile(): void {

    console.log(
      'Loading student profile...'
    );


    this.authService
      .getCurrentStudent()
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (data: StudentProfile) => {

          console.log(
            'Student profile received:',
            data
          );


          this.student = data;


          this.cdr.detectChanges();

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error) => {

          console.error(
            'Failed to load student profile:',
            error
          );


          if (
            error.status === 401
          ) {

            console.warn(
              'Session expired. Redirecting to login...'
            );


            this.authService.logout();


            this.router.navigate([
              '/login'
            ]);

          }

        }

      });

  }



  // =====================================================
  // LOAD UNREAD NOTIFICATION COUNT
  // =====================================================

  loadUnreadNotificationCount(): void {

    const storedStudentId =
      localStorage.getItem('studentId');


    console.log(
      'Dashboard notification Student ID:',
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

        // ===============================================
        // SUCCESS
        // ===============================================

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
            'Dashboard unread notifications:',
            this.unreadCount
          );


          this.cdr.detectChanges();

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error) => {

          console.error(
            'Failed to load dashboard notification count:',
            error
          );


          this.unreadCount = 0;

          this.cdr.detectChanges();

        }

      });

  }



  // =====================================================
  // GO TO PROFILE
  // =====================================================

  goToProfile(): void {

    console.log(
      'Opening student profile...'
    );


    this.router.navigate([
      '/profile'
    ]);

  }



  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    console.log(
      'Student logging out...'
    );


    this.authService.logout();


    this.router.navigate([
      '/login'
    ]);

  }

}