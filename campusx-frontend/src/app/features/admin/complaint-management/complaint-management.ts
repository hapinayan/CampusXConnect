import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  Complaint,
  UpdateComplaintStatus
} from '../../../core/models/complaint';

import {
  ComplaintService
} from '../../../core/services/complaint.service';

// =====================================================
// ADMIN SIDEBAR
// =====================================================

import {
  AdminSidebar
} from '../shared/admin-sidebar/admin-sidebar';


@Component({
  selector: 'app-complaint-management',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar
  ],

  templateUrl: './complaint-management.html',
  styleUrl: './complaint-management.css'
})
export class ComplaintManagement implements OnInit {


  // =====================================================
  // COMPLAINT LIST
  // =====================================================

  complaints: Complaint[] = [];


  // =====================================================
  // STATE
  // =====================================================

  loading = false;

  saving = false;

  errorMessage = '';

  successMessage = '';


  // =====================================================
  // FILTER
  // =====================================================

  statusFilter = '';


  // =====================================================
  // SELECTED COMPLAINT
  // =====================================================

  selectedComplaint: Complaint | null = null;


  // =====================================================
  // UPDATE FORM
  // =====================================================

  selectedStatus = 0;

  resolutionNote = '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private complaintService: ComplaintService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadComplaints();

  }


  // =====================================================
  // LOAD ALL COMPLAINTS
  // =====================================================

  loadComplaints(): void {

    this.loading = true;

    this.errorMessage = '';


    const status =
      this.statusFilter === ''
        ? undefined
        : Number(this.statusFilter);


    this.complaintService
      .getAllComplaints(status)
      .pipe(

        finalize(() => {

          this.loading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (complaints) => {

          console.log(
            'Complaints loaded:',
            complaints
          );


          this.complaints =
            Array.isArray(complaints)
              ? complaints
              : [];


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load complaints:',
            error
          );


          this.complaints = [];


          if (error.status === 401) {

            this.errorMessage =
              'Unauthorized. Please login again as admin.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to access complaints.';

          }

          else {

            this.errorMessage =
              error?.error?.message ||
              'Failed to load complaints.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // STATUS FILTER CHANGE
  // =====================================================

  onStatusFilterChange(): void {

    this.loadComplaints();

  }


  // =====================================================
  // OPEN UPDATE MODAL
  // =====================================================

  openUpdate(
    complaint: Complaint
  ): void {

    this.errorMessage = '';

    this.successMessage = '';


    this.selectedComplaint =
      complaint;


    this.selectedStatus =
      this.statusToNumber(
        complaint.status
      );


    this.resolutionNote =
      complaint.resolutionNote || '';


    this.cdr.detectChanges();

  }


  // =====================================================
  // UPDATE STATUS
  // =====================================================

  updateStatus(): void {

    if (!this.selectedComplaint) {

      return;

    }


    if (this.saving) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';

    this.saving = true;


    const data: UpdateComplaintStatus = {

      status:
        this.selectedStatus,

      resolutionNote:
        this.resolutionNote.trim() || undefined

    };


    this.complaintService
      .updateComplaintStatus(
        this.selectedComplaint.id,
        data
      )
      .pipe(

        finalize(() => {

          this.saving = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (complaint) => {

          console.log(
            'Complaint updated:',
            complaint
          );


          this.successMessage =
            'Complaint status updated successfully!';


          this.closeUpdate();

          this.loadComplaints();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to update complaint:',
            error
          );


          if (error.status === 401) {

            this.errorMessage =
              'Unauthorized. Please login again as admin.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to update this complaint.';

          }

          else if (error.status === 400) {

            this.errorMessage =
              error?.error?.message ||
              error?.error?.title ||
              'Invalid complaint status.';

          }

          else {

            this.errorMessage =
              error?.error?.message ||
              'Failed to update complaint status.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CLOSE UPDATE MODAL
  // =====================================================

  closeUpdate(): void {

    this.selectedComplaint = null;

    this.selectedStatus = 0;

    this.resolutionNote = '';


    this.cdr.detectChanges();

  }


  // =====================================================
  // STATUS → NUMBER
  //
  // 0 = Pending
  // 1 = In Progress
  // 2 = Resolved
  // =====================================================

  private statusToNumber(
    status: string | number
  ): number {

    if (typeof status === 'number') {

      return status;

    }


    const normalized =
      status
        .toLowerCase()
        .replace(/\s/g, '');


    switch (normalized) {

      case 'inprogress':
        return 1;

      case 'resolved':
        return 2;

      case 'pending':
      default:
        return 0;

    }

  }


  // =====================================================
  // STATUS LABEL
  // =====================================================

  getStatusLabel(
    status: string | number
  ): string {

    if (typeof status === 'number') {

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
      default:
        return 'Pending';

    }

  }


  // =====================================================
  // STATUS CSS CLASS
  // =====================================================

  getStatusClass(
    status: string | number
  ): string {

    switch (
      this.statusToNumber(status)
    ) {

      case 1:
        return 'in-progress';

      case 2:
        return 'resolved';

      case 0:
      default:
        return 'pending';

    }

  }


  // =====================================================
  // TOTAL COMPLAINTS
  // =====================================================

  get totalComplaints(): number {

    return this.complaints.length;

  }


  // =====================================================
  // PENDING COMPLAINTS
  // =====================================================

  get pendingComplaints(): number {

    return this.complaints.filter(

      complaint =>
        this.statusToNumber(
          complaint.status
        ) === 0

    ).length;

  }


  // =====================================================
  // IN PROGRESS COMPLAINTS
  // =====================================================

  get inProgressComplaints(): number {

    return this.complaints.filter(

      complaint =>
        this.statusToNumber(
          complaint.status
        ) === 1

    ).length;

  }


  // =====================================================
  // RESOLVED COMPLAINTS
  // =====================================================

  get resolvedComplaints(): number {

    return this.complaints.filter(

      complaint =>
        this.statusToNumber(
          complaint.status
        ) === 2

    ).length;

  }

}