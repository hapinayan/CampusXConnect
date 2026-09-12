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
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  ngOnInit(): void {

    console.log(
      'Complaints page initialized'
    );


    this.loadCategories();

    this.loadMyComplaints();

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


    // ===================================================
    // STUDENT ID NOT FOUND
    // ===================================================

    if (!storedStudentId) {

      this.complaints = [];

      this.complaintsLoading = false;

      this.cdr.detectChanges();

      return;

    }


    const studentId =
      Number(storedStudentId);


    // ===================================================
    // INVALID STUDENT ID
    // ===================================================

    if (!studentId) {

      this.complaints = [];

      this.complaintsLoading = false;

      this.cdr.detectChanges();

      return;

    }


    // ===================================================
    // LOAD COMPLAINTS
    // ===================================================

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


    // ===================================================
    // VALIDATION
    // ===================================================

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


    // ===================================================
    // PREVENT DOUBLE SUBMISSION
    // ===================================================

    if (this.submitting) {

      return;

    }


    this.submitting = true;


    // ===================================================
    // CREATE REQUEST
    // ===================================================

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


    // ===================================================
    // API REQUEST
    // ===================================================

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


          // Clear form

          this.selectedCategoryId = null;

          this.description = '';


          // Reload complaint history

          this.loadMyComplaints();


          this.cdr.detectChanges();


          // Hide success message

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


          // BAD REQUEST

          if (
            error.status === 400
          ) {

            this.errorMessage =
              error.error?.message ||
              error.error?.title ||
              'Invalid complaint details.';

          }


          // UNAUTHORIZED

          else if (
            error.status === 401
          ) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }


          // NOT FOUND

          else if (
            error.status === 404
          ) {

            this.errorMessage =
              error.error?.message ||
              'Complaint category was not found.';

          }


          // OTHER

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


    return (
      category?.name ||
      `Category #${categoryId}`
    );

  }


  // =====================================================
  // GET STATUS CLASS
  // Supports both STRING and NUMBER status
  // =====================================================

  getStatusClass(
    status: string | number
  ): string {

    // ===================================================
    // NUMERIC STATUS
    // 0 = Pending
    // 1 = In Progress
    // 2 = Resolved
    // ===================================================

    if (
      typeof status === 'number'
    ) {

      switch (status) {

        case 1:
          return 'status-progress';

        case 2:
          return 'status-resolved';

        case 0:
        default:
          return 'status-pending';

      }

    }


    // ===================================================
    // STRING STATUS
    // ===================================================

    const normalized =
      status
        .toLowerCase()
        .replace(/\s/g, '');


    switch (normalized) {

      case 'inprogress':
        return 'status-progress';

      case 'resolved':
        return 'status-resolved';

      case 'pending':
        return 'status-pending';

      default:
        return 'status-default';

    }

  }


  // =====================================================
  // GET STATUS LABEL
  // =====================================================

  getStatusLabel(
    status: string | number
  ): string {

    // Numeric status

    if (
      typeof status === 'number'
    ) {

      switch (status) {

        case 1:
          return 'In Progress';

        case 2:
          return 'Resolved';

        case 0:
        default:
          return 'Pending';

      }

    }


    // String status

    const normalized =
      status
        .toLowerCase()
        .replace(/\s/g, '');


    switch (normalized) {

      case 'inprogress':
        return 'In Progress';

      case 'resolved':
        return 'Resolved';

      case 'pending':
        return 'Pending';

      default:
        return status;

    }

  }


  // =====================================================
  // REFRESH COMPLAINTS
  // =====================================================

  refreshComplaints(): void {

    this.errorMessage = '';

    this.successMessage = '';


    this.loadCategories();

    this.loadMyComplaints();

  }

}