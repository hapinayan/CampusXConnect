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

  selectedStatus: string = 'All';


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
        request.status === 'ReadyForCollection'
    ).length
  );


  // =====================================================
  // FILTERED REQUESTS
  // =====================================================

  filteredRequests = computed(() => {

    if (this.selectedStatus === 'All') {
      return this.requests();
    }

    return this.requests().filter(
      request =>
        request.status === this.selectedStatus
    );

  });


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
  // FILTER
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
    request: CertificateRequest,
    status: CertificateStatus
  ): void {

    this.certificateService
      .updateStatus(
        request.id,
        status
      )
      .subscribe({

        next: () => {

          this.loadRequests();

        },


        error: (error) => {

          console.error(
            'Error updating certificate status:',
            error
          );

          this.errorMessage.set(
            'Unable to update certificate status.'
          );

        }

      });

  }


  // =====================================================
  // CERTIFICATE TYPE NAME
  // Backend can return string or numeric enum
  // =====================================================

  getTypeName(
    type: CertificateType | string | number
  ): string {

    if (typeof type === 'string') {

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

}