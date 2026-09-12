import {
  Component,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Complaint,
  ComplaintStatus,
  UpdateComplaintStatus
} from '../../../../core/models/complaint';

import {
  ComplaintService
} from '../../../../core/services/complaint.service';


@Component({
  selector: 'app-admin-complaints',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './admin-complaints.html',
  styleUrl: './admin-complaints.css'
})
export class AdminComplaints implements OnInit {

  // =====================================================
  // STATE
  // =====================================================

  complaints = signal<Complaint[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');

  selectedStatus: string = 'All';


  // =====================================================
  // COUNTS
  // =====================================================

  totalComplaints = computed(() =>
    this.complaints().length
  );


  pendingComplaints = computed(() =>
    this.complaints().filter(
      complaint =>
        complaint.status === 'Pending'
    ).length
  );


  inProgressComplaints = computed(() =>
    this.complaints().filter(
      complaint =>
        complaint.status === 'InProgress'
    ).length
  );


  resolvedComplaints = computed(() =>
    this.complaints().filter(
      complaint =>
        complaint.status === 'Resolved'
    ).length
  );


  // =====================================================
  // FILTERED COMPLAINTS
  // =====================================================

  filteredComplaints = computed(() => {

    if (
      this.selectedStatus === 'All'
    ) {
      return this.complaints();
    }

    return this.complaints().filter(
      complaint =>
        complaint.status ===
        this.selectedStatus
    );

  });


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private complaintService:
      ComplaintService
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

    this.isLoading.set(true);

    this.errorMessage.set('');


    this.complaintService
      .getAllComplaints()
      .subscribe({

        next: (complaints) => {

          this.complaints.set(
            complaints
          );

          this.isLoading.set(false);

          console.log(
            'Admin complaints loaded:',
            complaints
          );

        },


        error: (error) => {

          console.error(
            'Error loading complaints:',
            error
          );

          this.errorMessage.set(
            'Unable to load complaints.'
          );

          this.isLoading.set(false);

        }

      });

  }


  // =====================================================
  // STATUS FILTER
  // =====================================================

  changeFilter(
    status: string
  ): void {

    this.selectedStatus = status;

  }


  // =====================================================
  // UPDATE STATUS
  // =====================================================

  updateStatus(
    complaint: Complaint,
    status: ComplaintStatus
  ): void {

    const data:
      UpdateComplaintStatus = {

      status: status,

      resolutionNote:
        complaint.resolutionNote || ''

    };


    this.complaintService
      .updateComplaintStatus(
        complaint.id,
        data
      )
      .subscribe({

        next: () => {

          this.loadComplaints();

        },


        error: (error) => {

          console.error(
            'Error updating complaint status:',
            error
          );

          this.errorMessage.set(
            'Unable to update complaint status.'
          );

        }

      });

  }

}