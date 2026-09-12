import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  CertificateRequest,
  CertificateType,
  CertificateStatus,
  UpdateCertificateStatus
} from '../../../core/models/certificate';

import {
  CertificateService
} from '../../../core/services/certificate.service';

// =====================================================
// ADMIN SIDEBAR
// =====================================================

import {
  AdminSidebar
} from '../shared/admin-sidebar/admin-sidebar';


@Component({
  selector: 'app-certificate-management',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar
  ],

  templateUrl: './certificate-management.html',
  styleUrl: './certificate-management.css'
})
export class CertificateManagement implements OnInit {


  // =====================================================
  // CERTIFICATE REQUEST LIST
  // =====================================================

  requests: CertificateRequest[] = [];


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
  // SELECTED REQUEST
  // =====================================================

  selectedRequest: CertificateRequest | null = null;


  // =====================================================
  // STATUS FORM
  // =====================================================

  selectedStatus = 0;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private certificateService: CertificateService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadRequests();

  }


  // =====================================================
  // LOAD ADMIN CERTIFICATE REQUESTS
  // GET /api/certificate-requests/admin
  // =====================================================

  loadRequests(): void {

    this.loading = true;

    this.errorMessage = '';


    this.certificateService
      .getAdminRequests()
      .pipe(

        finalize(() => {

          this.loading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (data) => {

          console.log(
            'Certificate requests loaded:',
            data
          );


          this.requests =
            Array.isArray(data)
              ? data
              : [];


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load certificate requests:',
            error
          );


          this.requests = [];


          if (error.status === 401) {

            this.errorMessage =
              'Unauthorized. Please login again as admin.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to access certificate requests.';

          }

          else {

            this.errorMessage =
              error?.error?.message ||
              'Failed to load certificate requests.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // OPEN STATUS UPDATE MODAL
  // =====================================================

  openUpdate(
    request: CertificateRequest
  ): void {

    this.errorMessage = '';

    this.successMessage = '';


    this.selectedRequest =
      request;


    this.selectedStatus =
      this.statusToNumber(
        request.status
      );


    this.cdr.detectChanges();

  }


  // =====================================================
  // UPDATE CERTIFICATE STATUS
  // PUT /api/certificate-requests/{id}/status
  // =====================================================

  updateStatus(): void {

    if (!this.selectedRequest) {

      return;

    }


    if (this.saving) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';

    this.saving = true;


    const data: UpdateCertificateStatus = {

      status:
        this.selectedStatus

    };


    this.certificateService
      .updateRequestStatus(
        this.selectedRequest.id,
        data
      )
      .pipe(

        finalize(() => {

          this.saving = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (response) => {

          console.log(
            'Certificate status updated:',
            response
          );


          this.successMessage =
            'Certificate request status updated successfully!';


          this.closeUpdate();

          this.loadRequests();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to update certificate status:',
            error
          );


          if (error.status === 401) {

            this.errorMessage =
              'Unauthorized. Please login again as admin.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to update this request.';

          }

          else if (error.status === 400) {

            this.errorMessage =
              error?.error?.message ||
              error?.error?.title ||
              'Invalid certificate status.';

          }

          else {

            this.errorMessage =
              error?.error?.message ||
              'Failed to update certificate request status.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CLOSE UPDATE MODAL
  // =====================================================

  closeUpdate(): void {

    this.selectedRequest = null;

    this.selectedStatus = 0;


    this.cdr.detectChanges();

  }


  // =====================================================
  // FILTERED REQUESTS
  // =====================================================

  get filteredRequests():
    CertificateRequest[] {

    if (!this.statusFilter) {

      return this.requests;

    }


    return this.requests.filter(

      request =>
        this.statusToNumber(
          request.status
        ).toString() ===
        this.statusFilter

    );

  }


  // =====================================================
  // CERTIFICATE TYPE LABEL
  //
  // Backend response:
  // "Enrollment"
  // "Academic"
  // "Character"
  // "Other"
  //
  // Create request:
  // 0 / 1 / 2 / 3
  // =====================================================

  getTypeLabel(
    type: CertificateType | string | number
  ): string {

    if (typeof type === 'string') {

      const normalized =
        type
          .trim()
          .toLowerCase();


      switch (normalized) {

        case 'enrollment':
          return 'Enrollment';

        case 'academic':
          return 'Academic';

        case 'character':
          return 'Character';

        case 'other':
          return 'Other';

        default:
          return type;

      }

    }


    switch (Number(type)) {

      case CertificateType.Enrollment:
        return 'Enrollment';

      case CertificateType.Academic:
        return 'Academic';

      case CertificateType.Character:
        return 'Character';

      case CertificateType.Other:
        return 'Other';

      default:
        return 'Unknown';

    }

  }


  // =====================================================
  // STATUS → NUMBER
  //
  // 0 = Pending
  // 1 = Approved
  // 2 = Rejected
  // 3 = ReadyForCollection
  // =====================================================

  private statusToNumber(
    status: CertificateStatus | string | number
  ): number {

    if (typeof status === 'number') {

      return status;

    }


    const normalized =
      status
        .trim()
        .toLowerCase()
        .replace(/\s/g, '');


    switch (normalized) {

      case 'approved':
        return 1;

      case 'rejected':
        return 2;

      case 'readyforcollection':
        return 3;

      case 'pending':
      default:
        return 0;

    }

  }


  // =====================================================
  // STATUS LABEL
  // =====================================================

  getStatusLabel(
    status: CertificateStatus | string | number
  ): string {

    const value =
      this.statusToNumber(status);


    switch (value) {

      case 1:
        return 'Approved';

      case 2:
        return 'Rejected';

      case 3:
        return 'Ready For Collection';

      case 0:
      default:
        return 'Pending';

    }

  }


  // =====================================================
  // STATUS CSS CLASS
  // =====================================================

  getStatusClass(
    status: CertificateStatus | string | number
  ): string {

    const value =
      this.statusToNumber(status);


    switch (value) {

      case 1:
        return 'approved';

      case 2:
        return 'rejected';

      case 3:
        return 'ready';

      case 0:
      default:
        return 'pending';

    }

  }


  // =====================================================
  // TOTAL REQUESTS
  // =====================================================

  get totalRequests(): number {

    return this.requests.length;

  }


  // =====================================================
  // PENDING REQUESTS
  // =====================================================

  get pendingRequests(): number {

    return this.requests.filter(

      request =>
        this.statusToNumber(
          request.status
        ) === 0

    ).length;

  }


  // =====================================================
  // APPROVED REQUESTS
  // =====================================================

  get approvedRequests(): number {

    return this.requests.filter(

      request =>
        this.statusToNumber(
          request.status
        ) === 1

    ).length;

  }


  // =====================================================
  // REJECTED REQUESTS
  // =====================================================

  get rejectedRequests(): number {

    return this.requests.filter(

      request =>
        this.statusToNumber(
          request.status
        ) === 2

    ).length;

  }


  // =====================================================
  // READY FOR COLLECTION
  // =====================================================

  get readyRequests(): number {

    return this.requests.filter(

      request =>
        this.statusToNumber(
          request.status
        ) === 3

    ).length;

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refreshRequests(): void {

    this.errorMessage = '';

    this.successMessage = '';

    this.loadRequests();

  }

}