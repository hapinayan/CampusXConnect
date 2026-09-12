import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HostelService } from '../../../../core/services/hostel.service';
import { NotificationService } from '../../../../core/services/notification.service';

import {
  Hostel,
  HostelApplication
} from '../../../../core/models/hostel';


@Component({
  selector: 'app-hostel',
  standalone: true,

  imports: [
    RouterLink,
    FormsModule,
    DatePipe
  ],

  templateUrl: './hostel.html',
  styleUrl: './hostel.css'
})
export class HostelPage implements OnInit {

  // =========================
  // STUDENT
  // =========================

  student: any = null;


  // =========================
  // NOTIFICATION COUNT
  // =========================

  unreadCount = 0;


  // =========================
  // HOSTELS
  // =========================

  hostels: Hostel[] = [];

  hostelsLoading = true;


  // =========================
  // SELECTED HOSTEL
  // =========================

  selectedHostelId: number | null = null;


  // =========================
  // PREFERENCES
  // =========================

  preferences = '';


  // =========================
  // APPLICATION
  // =========================

  application: HostelApplication | null = null;


  // =========================
  // UI STATES
  // =========================

  submitting = false;

  errorMessage = '';

  successMessage = '';


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private hostelService: HostelService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================
  // INITIAL LOAD
  // =========================

  ngOnInit(): void {

    this.loadStudent();

    this.loadUnreadNotificationCount();

    this.loadHostels();

    this.loadMyApplication();

  }


  // =========================
  // LOAD STUDENT
  // =========================

  loadStudent(): void {

    const storedStudent =
      localStorage.getItem('student');


    if (storedStudent) {

      try {

        this.student =
          JSON.parse(storedStudent);


        console.log(
          'Logged-in student:',
          this.student
        );

      }

      catch {

        console.error(
          'Invalid student data in localStorage.'
        );


        this.student = null;

      }

    }

  }


  // =========================
  // LOAD UNREAD NOTIFICATION COUNT
  // =========================

  loadUnreadNotificationCount(): void {

    const storedStudentId =
      localStorage.getItem('studentId');


    console.log(
      'Hostel notification Student ID:',
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
            'Hostel unread notifications:',
            this.unreadCount
          );


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load hostel notification count:',
            error
          );


          this.unreadCount = 0;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // LOAD HOSTELS
  // =========================

  loadHostels(): void {

    this.hostelsLoading = true;


    this.hostelService
      .getHostels()
      .subscribe({

        next: (data) => {

          this.hostels = data;

          this.hostelsLoading = false;


          console.log(
            'Hostels:',
            data
          );


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load hostels:',
            error
          );


          this.hostelsLoading = false;


          this.errorMessage =
            'Unable to load hostel information.';


          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // LOAD MY APPLICATION
  // =========================

  loadMyApplication(): void {

    this.hostelService
      .getMyApplication()
      .subscribe({

        next: (data) => {

          this.application = data;


          console.log(
            'My hostel application:',
            data
          );


          this.cdr.detectChanges();

        },


        error: () => {

          console.log(
            'No hostel application found.'
          );


          this.application = null;


          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // SUBMIT APPLICATION
  // =========================

  submitApplication(): void {

    this.errorMessage = '';

    this.successMessage = '';


    if (!this.selectedHostelId) {

      this.errorMessage =
        'Please select a hostel.';

      return;

    }


    if (this.submitting) {

      return;

    }


    this.submitting = true;


    this.hostelService
      .applyForHostel(
        this.selectedHostelId,
        this.preferences
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Hostel application submitted:',
            response
          );


          this.submitting = false;


          this.successMessage =
            'Hostel application submitted successfully.';


          this.loadMyApplication();


          this.selectedHostelId = null;

          this.preferences = '';


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Hostel application failed:',
            error
          );


          this.submitting = false;


          if (error.status === 400) {

            this.errorMessage =
              error.error?.message ||
              'Unable to submit hostel application.';

          }

          else if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }

          else if (error.status === 409) {

            this.errorMessage =
              error.error?.message ||
              'You already have a hostel application.';

          }

          else {

            this.errorMessage =
              'Something went wrong. Please try again.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // GET APPLICATION STATUS
  // =========================

  getApplicationStatus(): string {

    if (!this.application) {

      return 'No Application';

    }


    return this.application.status ||
      'Pending';

  }

}