import {
  Component,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  CertificateRequest,
  CertificateStatus,
  CertificateType
} from '../../../../core/models/certificate';

import {
  CertificateService
} from '../../../../core/services/certificate.service';


@Component({
  selector: 'app-admin-certificates',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './admin-certificates.html',
  styleUrl: './admin-certificates.css'
})
export class AdminCertificates implements OnInit {

  // =====================================================
  // STATE
  // =====================================================

  requests = signal<CertificateRequest[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');

  successMessage = signal('');

  selectedStatus: string = 'All';


  // =====================================================
  // ACTION STATE
  // =====================================================

  updatingRequestId =
    signal<number | null>(null);

  rejectingRequestId =
    signal<number | null>(null);

  rejectionReason = '';


  // =====================================================
  // COUNTS
  // =====================================================

  totalRequests = computed(() =>
    this.requests().length
  );


  pendingRequests = computed(() =>
    this.requests().filter(
      request =>
        request.status === 'Pending'
    ).length
  );


  approvedRequests = computed(() =>
    this.requests().filter(
      request =>
        request.status === 'Approved'
    ).length
  );


  rejectedRequests = computed(() =>
    this.requests().filter(
      request =>
        request.status === 'Rejected'
    ).length
  );


  readyRequests = computed(() =>
    this.requests().filter(
      request =>
        request.status === 'Issued'
    ).length
  );


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private certificateService:
      CertificateService
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    this.loadRequests();
  }


  // =====================================================
  // LOAD ALL REQUESTS
  // =====================================================

  loadRequests(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');


    this.certificateService
      .getAllRequests()
      .subscribe({

        next: (requests) => {

          this.requests.set(requests);

          this.isLoading.set(false);

          console.log(
            'Admin certificate requests loaded:',
            requests
          );

        },


        error: (error) => {

          console.error(
            'Error loading certificate requests:',
            error
          );

          this.errorMessage.set(
            'Unable to load certificate requests.'
          );

          this.isLoading.set(false);

        }

      });

  }


  // =====================================================
  // FILTERED REQUESTS
  // =====================================================

  filteredRequests():
    CertificateRequest[] {

    if (
      this.selectedStatus === 'All'
    ) {
      return this.requests();
    }


    if (
      this.selectedStatus ===
      'ReadyForCollection'
    ) {
      return this.requests().filter(
        request =>
          request.status === 'Issued'
      );
    }


    return this.requests().filter(
      request =>
        request.status ===
        this.selectedStatus
    );

  }


  // =====================================================
  // FILTER
  // =====================================================

  changeFilter(
    status: string
  ): void {

    this.selectedStatus = status;

  }


  // =====================================================
  // APPROVE REQUEST
  // =====================================================

  approveRequest(
    request: CertificateRequest
  ): void {

    this.clearMessages();

    this.updatingRequestId.set(
      request.id
    );


    this.certificateService
      .updateStatus(
        request.id,
        'Approved'
      )
      .subscribe({

        next: () => {

          this.successMessage.set(
            'Certificate request approved successfully.'
          );

          this.updatingRequestId.set(
            null
          );

          this.loadRequests();

        },


        error: (error) => {

          console.error(
            'Error approving certificate request:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ||
            'Unable to approve certificate request.'
          );

          this.updatingRequestId.set(
            null
          );

        }

      });

  }


  // =====================================================
  // START REJECT
  // =====================================================

  startReject(
    request: CertificateRequest
  ): void {

    this.clearMessages();

    this.rejectingRequestId.set(
      request.id
    );

    this.rejectionReason = '';

  }


  // =====================================================
  // CANCEL REJECT
  // =====================================================

  cancelReject(): void {

    this.rejectingRequestId.set(
      null
    );

    this.rejectionReason = '';

  }


  // =====================================================
  // CONFIRM REJECT
  // =====================================================

  confirmReject(
    request: CertificateRequest
  ): void {

    this.clearMessages();


    if (
      !this.rejectionReason.trim()
    ) {

      this.errorMessage.set(
        'Please enter a rejection reason.'
      );

      return;

    }


    this.updatingRequestId.set(
      request.id
    );


    this.certificateService
      .updateStatus(
        request.id,
        'Rejected',
        this.rejectionReason.trim()
      )
      .subscribe({

        next: () => {

          this.successMessage.set(
            'Certificate request rejected successfully.'
          );

          this.updatingRequestId.set(
            null
          );

          this.cancelReject();

          this.loadRequests();

        },


        error: (error) => {

          console.error(
            'Error rejecting certificate request:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ||
            'Unable to reject certificate request.'
          );

          this.updatingRequestId.set(
            null
          );

        }

      });

  }


  // =====================================================
  // MARK READY FOR COLLECTION
  // Backend status = Issued
  // =====================================================

  markReadyForCollection(
    request: CertificateRequest
  ): void {

    this.clearMessages();

    this.updatingRequestId.set(
      request.id
    );


    this.certificateService
      .updateStatus(
        request.id,
        'Issued'
      )
      .subscribe({

        next: () => {

          this.successMessage.set(
            'Certificate marked ready for collection.'
          );

          this.updatingRequestId.set(
            null
          );

          this.loadRequests();

        },


        error: (error) => {

          console.error(
            'Error marking certificate ready:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ||
            'Unable to mark certificate ready for collection.'
          );

          this.updatingRequestId.set(
            null
          );

        }

      });

  }


  // =====================================================
  // HELPERS
  // =====================================================

  isUpdating(
    requestId: number
  ): boolean {

    return (
      this.updatingRequestId() ===
      requestId
    );

  }


  isRejecting(
    requestId: number
  ): boolean {

    return (
      this.rejectingRequestId() ===
      requestId
    );

  }


  clearMessages(): void {

    this.errorMessage.set('');

    this.successMessage.set('');

  }


  // =====================================================
  // DISPLAY STATUS
  // =====================================================

  getStatusName(
    status: CertificateStatus
  ): string {

    if (status === 'Issued') {
      return 'Ready for Collection';
    }

    return status;

  }


  // =====================================================
  // CERTIFICATE TYPE NAME
  // =====================================================

  getTypeName(
    type: CertificateType | string | number
  ): string {

    if (
      typeof type === 'string'
    ) {

      switch (type) {

        case 'Enrollment':
          return 'Enrollment';

        case 'Academic':
          return 'Academic';

        case 'Character':
          return 'Character';

        case 'Other':
          return 'Other';

        default:
          return type || 'Unknown';

      }

    }


    switch (
      Number(type)
    ) {

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

}