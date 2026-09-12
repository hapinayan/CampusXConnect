import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { NotificationService } from '../../../../core/services/notification.service';
import { Notification } from '../../../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {

  // =====================================================
  // STUDENT PROFILE
  // =====================================================

  studentName = 'Student';


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  notifications: Notification[] = [];

  loading = true;


  // =====================================================
  // UI STATES
  // =====================================================

  errorMessage = '';

  successMessage = '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  ngOnInit(): void {

    console.log(
      'Notifications page initialized'
    );

    this.loadStudentProfile();

    this.loadNotifications();

  }


  // =====================================================
  // LOAD STUDENT PROFILE
  // =====================================================

  loadStudentProfile(): void {

    try {

      const storedStudent =
        localStorage.getItem('student');


      if (storedStudent) {

        const parsedStudent =
          JSON.parse(storedStudent);


        if (
          parsedStudent &&
          parsedStudent.fullName
        ) {

          this.studentName =
            parsedStudent.fullName.trim();


          console.log(
            'Student loaded from student object:',
            this.studentName
          );


          this.cdr.detectChanges();

          return;

        }

      }


      const fullName =
        localStorage.getItem('fullName');


      if (
        fullName &&
        fullName.trim().length > 0
      ) {

        this.studentName =
          fullName.trim();


        console.log(
          'Student loaded from fullName:',
          this.studentName
        );


        this.cdr.detectChanges();

        return;

      }


      const storedStudentName =
        localStorage.getItem('studentName');


      if (
        storedStudentName &&
        storedStudentName.trim().length > 0
      ) {

        this.studentName =
          storedStudentName.trim();


        console.log(
          'Student loaded from studentName:',
          this.studentName
        );


        this.cdr.detectChanges();

        return;

      }


      this.studentName = 'Student';

      console.warn(
        'Student name not found in localStorage.'
      );

      this.cdr.detectChanges();

    }

    catch (error) {

      console.error(
        'Failed to load student profile:',
        error
      );

      this.studentName = 'Student';

      this.cdr.detectChanges();

    }

  }


  // =====================================================
  // GET STUDENT INITIAL
  // =====================================================

  getStudentInitial(): string {

    if (
      !this.studentName ||
      this.studentName.trim() === '' ||
      this.studentName === 'Student'
    ) {

      return 'S';

    }


    return this.studentName
      .trim()
      .charAt(0)
      .toUpperCase();

  }


  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  loadNotifications(): void {

    const storedStudentId =
      localStorage.getItem('studentId');


    console.log(
      'Stored Student ID:',
      storedStudentId
    );


    if (!storedStudentId) {

      this.notifications = [];

      this.loading = false;

      this.errorMessage =
        'Student information not found.';

      this.cdr.detectChanges();

      return;

    }


    const studentId =
      Number(storedStudentId);


    if (!studentId) {

      this.notifications = [];

      this.loading = false;

      this.errorMessage =
        'Invalid student information.';

      this.cdr.detectChanges();

      return;

    }


    this.loading = true;

    this.errorMessage = '';


    this.notificationService
      .getMyNotifications(studentId)
      .pipe(

        finalize(() => {

          this.loading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (data) => {

          console.log(
            'Notifications loaded:',
            data
          );


          this.notifications =
            Array.isArray(data)
              ? data
              : [];


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load notifications:',
            error
          );


          this.notifications = [];


          if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }

          else if (error.status === 404) {

            this.errorMessage =
              'No notifications found.';

          }

          else {

            this.errorMessage =
              'Unable to load notifications.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // MARK NOTIFICATION AS READ
  // =====================================================

  markAsRead(
    notification: Notification
  ): void {

    if (notification.isRead) {

      return;

    }


    console.log(
      'Marking notification as read:',
      notification.id
    );


    this.notificationService
      .markAsRead(notification.id)
      .subscribe({

        next: () => {

          notification.isRead = true;


          this.successMessage =
            'Notification marked as read.';


          this.cdr.detectChanges();


          setTimeout(() => {

            this.successMessage = '';

            this.cdr.detectChanges();

          }, 3000);

        },


        error: (error) => {

          console.error(
            'Failed to mark notification as read:',
            error
          );


          if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }

          else if (error.status === 404) {

            this.errorMessage =
              'Notification not found.';

          }

          else {

            this.errorMessage =
              'Unable to mark notification as read.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // COUNT UNREAD NOTIFICATIONS
  // =====================================================

  get unreadCount(): number {

    return this.notifications.filter(
      notification =>
        !notification.isRead
    ).length;

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refreshNotifications(): void {

    this.successMessage = '';

    this.errorMessage = '';

    this.loadNotifications();

  }

}