import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  CreateNotificationRequest,
  NotificationService
} from '../../../core/services/notification.service';

import {
  AdminSidebar
} from '../shared/admin-sidebar/admin-sidebar';


@Component({
  selector: 'app-notification-management',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar
  ],

  templateUrl: './notification-management.html',
  styleUrl: './notification-management.css'
})
export class NotificationManagement {


  // =====================================================
  // FORM DATA
  // =====================================================

  studentId: number | null = null;

  title = '';

  message = '';

  type = 0;


  // =====================================================
  // PAGE STATE
  // =====================================================

  sending = false;

  errorMessage = '';

  successMessage = '';


  // =====================================================
  // COUNTER
  // =====================================================

  sentCount = 0;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // SEND NOTIFICATION
  // POST /api/notifications
  // =====================================================

  sendNotification(): void {

    this.errorMessage = '';

    this.successMessage = '';


    if (
      this.studentId === null ||
      this.studentId <= 0
    ) {

      this.errorMessage =
        'Please enter a valid student ID.';

      return;

    }


    if (!this.title.trim()) {

      this.errorMessage =
        'Please enter notification title.';

      return;

    }


    if (!this.message.trim()) {

      this.errorMessage =
        'Please enter notification message.';

      return;

    }


    if (this.sending) {

      return;

    }


    const request: CreateNotificationRequest = {

      studentId: this.studentId,

      title: this.title.trim(),

      message: this.message.trim(),

      type: this.type

    };


    this.sending = true;


    this.notificationService
      .createNotification(request)
      .pipe(

        finalize(() => {

          this.sending = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (response) => {

          console.log(
            'Notification created successfully:',
            response
          );


          this.successMessage =
            response?.message ||
            'Notification sent successfully!';


          this.sentCount++;


          this.resetForm();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to create notification:',
            error
          );


          if (error.status === 401) {

            this.errorMessage =
              'Unauthorized. Please login again as admin.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'Only administrators can send notifications.';

          }

          else if (error.status === 400) {

            this.errorMessage =
              error?.error?.message ||
              error?.error?.title ||
              'Invalid notification data.';

          }

          else {

            this.errorMessage =
              error?.error?.message ||
              'Failed to send notification.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // RESET FORM
  // =====================================================

  resetForm(): void {

    this.studentId = null;

    this.title = '';

    this.message = '';

    this.type = 0;

  }


  // =====================================================
  // CLEAR FORM
  // =====================================================

  clearForm(): void {

    this.resetForm();

    this.errorMessage = '';

    this.successMessage = '';

    this.cdr.detectChanges();

  }


  // =====================================================
  // MESSAGE CHARACTER COUNT
  // =====================================================

  get messageLength(): number {

    return this.message.length;

  }


  // =====================================================
  // TITLE CHARACTER COUNT
  // =====================================================

  get titleLength(): number {

    return this.title.length;

  }

}