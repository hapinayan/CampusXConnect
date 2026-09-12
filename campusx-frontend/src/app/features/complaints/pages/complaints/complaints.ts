import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ComplaintService } from '../../../../core/services/complaint.service';
import { NotificationService } from '../../../../core/services/notification.service';

import {
  Complaint,
  ComplaintCategory,
  CreateComplaint
} from '../../../../core/models/complaint';


@Component({
  selector: 'app-complaints',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './complaints.html',
  styleUrl: './complaints.css'
})
export class Complaints implements OnInit {

  // =====================================================
  // STUDENT PROFILE
  // =====================================================

  studentName = 'Student';


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  unreadCount = 0;


  // =====================================================
  // COMPLAINT CATEGORIES
  // =====================================================

  categories: ComplaintCategory[] = [];

  categoriesLoading = true;


  // =====================================================
  // MY COMPLAINTS
  // =====================================================

  complaints: Complaint[] = [];

  complaintsLoading = true;


  // =====================================================
  // FORM
  // =====================================================

  selectedCategoryId: number | null = null;

  description = '';


  // =====================================================
  // UI STATES
  // =====================================================

  submitting = false;

  errorMessage = '';

  successMessage = '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private complaintService: ComplaintService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  ngOnInit(): void {

    console.log(
      'Complaints page initialized'
    );

    this.loadStudentProfile();

    this.loadUnreadNotificationCount();

    this.loadCategories();

    this.loadMyComplaints();

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


      this.studentName =
        'Student';


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


      this.studentName =
        'Student';


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
  // LOAD UNREAD NOTIFICATION COUNT
  // =====================================================

  loadUnreadNotificationCount(): void {

    const storedStudentId =
      localStorage.getItem('studentId');


    console.log(
      'Complaints notification Student ID:',
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
            'Complaints unread notifications:',
            this.unreadCount
          );


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load Complaints notification count:',
            error
          );


          this.unreadCount = 0;

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  loadCategories(): void {

    this.categoriesLoading = true;


    this.complaintService
      .getCategories()
      .pipe(

        finalize(() => {

          this.categoriesLoading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (data) => {

          console.log(
            'Complaint categories:',
            data
          );


          this.categories =
            Array.isArray(data)
              ? data
              : [];


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load complaint categories:',
            error
          );


          this.categories = [];


          this.errorMessage =
            'Unable to load complaint categories.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD MY COMPLAINTS
  // =====================================================

  loadMyComplaints(): void {

    const storedStudentId =
      localStorage.getItem(
        'studentId'
      );


    console.log(
      'Stored Student ID:',
      storedStudentId
    );


    if (!storedStudentId) {

      this.complaints = [];

      this.complaintsLoading = false;

      this.cdr.detectChanges();

      return;

    }


    const studentId =
      Number(storedStudentId);


    if (!studentId) {

      this.complaints = [];

      this.complaintsLoading = false;

      this.cdr.detectChanges();

      return;

    }


    this.complaintsLoading = true;


    this.complaintService
      .getMyComplaints(
        studentId
      )
      .pipe(

        finalize(() => {

          this.complaintsLoading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (data) => {

          console.log(
            'My complaints:',
            data
          );


          this.complaints =
            Array.isArray(data)
              ? data
              : [];


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load complaints:',
            error
          );


          this.complaints = [];


          if (
            error.status !== 404
          ) {

            this.errorMessage =
              'Unable to load your complaints.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // SUBMIT COMPLAINT
  // =====================================================

  submitComplaint(): void {

    this.errorMessage = '';

    this.successMessage = '';


    if (
      !this.selectedCategoryId
    ) {

      this.errorMessage =
        'Please select a complaint category.';

      return;

    }


    if (
      !this.description.trim()
    ) {

      this.errorMessage =
        'Please enter your complaint description.';

      return;

    }


    if (
      this.description.trim().length < 10
    ) {

      this.errorMessage =
        'Complaint description must be at least 10 characters.';

      return;

    }


    if (this.submitting) {

      return;

    }


    this.submitting = true;


    const complaint: CreateComplaint = {

      categoryId:
        this.selectedCategoryId,

      description:
        this.description.trim()

    };


    console.log(
      'Complaint request:',
      complaint
    );


    this.complaintService
      .createComplaint(
        complaint
      )
      .pipe(

        finalize(() => {

          this.submitting = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (response) => {

          console.log(
            'Complaint submitted:',
            response
          );


          this.errorMessage = '';


          this.successMessage =
            'Complaint submitted successfully.';


          this.selectedCategoryId = null;

          this.description = '';


          this.loadMyComplaints();


          this.cdr.detectChanges();


          setTimeout(() => {

            this.successMessage = '';

            this.cdr.detectChanges();

          }, 5000);

        },


        error: (error) => {

          console.error(
            'Complaint submission failed:',
            error
          );


          this.successMessage = '';


          if (
            error.status === 400
          ) {

            this.errorMessage =
              error.error?.message ||
              error.error?.title ||
              'Invalid complaint details.';

          }


          else if (
            error.status === 401
          ) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }


          else if (
            error.status === 404
          ) {

            this.errorMessage =
              error.error?.message ||
              'Complaint category was not found.';

          }


          else {

            this.errorMessage =
              'Unable to submit complaint. Please try again.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // GET CATEGORY NAME
  // =====================================================

  getCategoryName(
    categoryId: number
  ): string {

    const category =
      this.categories.find(
        item =>
          item.id === categoryId
      );


    return category?.name ||
      `Category #${categoryId}`;

  }


  // =====================================================
  // GET STATUS CLASS
  // =====================================================

  getStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'Pending':
        return 'status-pending';

      case 'InProgress':
        return 'status-progress';

      case 'Resolved':
        return 'status-resolved';

      default:
        return 'status-default';

    }

  }


  // =====================================================
  // LATEST COMPLAINT
  // =====================================================

  get latestComplaint(): Complaint | null {

    if (
      !this.complaints ||
      this.complaints.length === 0
    ) {

      return null;

    }


    return [...this.complaints]
      .sort(
        (a, b) =>
          b.id - a.id
      )[0];

  }


  // =====================================================
  // CURRENT COMPLAINT STATUS
  // =====================================================

  get currentComplaintStatus(): string {

    return this.latestComplaint?.status || '';

  }


  // =====================================================
  // PROCESS STEP COMPLETED
  // =====================================================

  isProcessCompleted(
    step: number
  ): boolean {

    const status =
      this.currentComplaintStatus;


    if (!status) {

      return false;

    }


    switch (status) {

      case 'Pending':

        return step === 1;


      case 'InProgress':

        return step <= 2;


      case 'Resolved':

        return step <= 4;


      default:

        return false;

    }

  }


  // =====================================================
  // PROCESS STEP ACTIVE
  // =====================================================

  isProcessActive(
    step: number
  ): boolean {

    const status =
      this.currentComplaintStatus;


    if (!status) {

      return false;

    }


    switch (status) {

      case 'Pending':

        return step === 1;


      case 'InProgress':

        return step === 3;


      case 'Resolved':

        return step === 4;


      default:

        return false;

    }

  }


  // =====================================================
  // PROCESS STEP ICON
  // =====================================================

  getProcessStepIcon(
    step: number
  ): string {

    if (
      this.isProcessCompleted(step)
    ) {

      return '✓';

    }


    return step.toString();

  }


  // =====================================================
  // PROCESS STATUS TEXT
  // =====================================================

  getProcessStatusText(): string {

    switch (
      this.currentComplaintStatus
    ) {

      case 'Pending':

        return 'Your complaint has been submitted and is waiting for review.';


      case 'InProgress':

        return 'University staff are currently working on your complaint.';


      case 'Resolved':

        return 'Your complaint has been resolved successfully.';


      default:

        return 'Submit a complaint to start tracking its progress.';

    }

  }


  // =====================================================
  // PROCESS STATUS TITLE
  // =====================================================

  getProcessStatusTitle(): string {

    switch (
      this.currentComplaintStatus
    ) {

      case 'Pending':

        return 'Complaint Submitted';


      case 'InProgress':

        return 'Complaint In Progress';


      case 'Resolved':

        return 'Complaint Resolved';


      default:

        return 'No Active Complaint';

    }

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refreshComplaints(): void {

    this.errorMessage = '';

    this.successMessage = '';

    this.loadCategories();

    this.loadMyComplaints();

    this.loadUnreadNotificationCount();

  }

}