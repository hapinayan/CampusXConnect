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

    this.loadNotifications();

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


    // -----------------------------------------------------
    // STUDENT ID NOT FOUND
    // -----------------------------------------------------

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


    // -----------------------------------------------------
    // INVALID STUDENT ID
    // -----------------------------------------------------

    if (!studentId) {

      this.notifications = [];

      this.loading = false;

      this.errorMessage =
        'Invalid student information.';

      this.cdr.detectChanges();

      return;

    }


    // -----------------------------------------------------
    // LOADING
    // -----------------------------------------------------

    this.loading = true;

    this.errorMessage = '';


    // -----------------------------------------------------
    // API
    // -----------------------------------------------------

    this.notificationService
      .getMyNotifications(studentId)
      .pipe(

        finalize(() => {

          this.loading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        // =================================================
        // SUCCESS
        // =================================================

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


        // =================================================
        // ERROR
        // =================================================

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

    // Already read
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

        // =================================================
        // SUCCESS
        // =================================================

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


        // =================================================
        // ERROR
        // =================================================

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