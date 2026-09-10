import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CertificateService } from '../../../../core/services/certificate.service';

import {
  CertificateRequest,
  CertificateType
} from '../../../../core/models/certificate';


@Component({
  selector: 'app-certificates',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './certificates.html',
  styleUrl: './certificates.css'
})
export class Certificates implements OnInit {

  // =====================================================
  // CERTIFICATE TYPES
  // =====================================================

certificateTypes: CertificateType[] = [
  CertificateType.Enrollment,
  CertificateType.Academic,
  CertificateType.Character,
  CertificateType.Other
];

  // =====================================================
  // FORM
  // =====================================================

  certificateForm: FormGroup;


  // =====================================================
  // MY REQUESTS
  // =====================================================

  requests: CertificateRequest[] = [];

  requestsLoading = true;


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
    private fb: FormBuilder,
    private certificateService: CertificateService,
    private cdr: ChangeDetectorRef
  ) {

    this.certificateForm =
      this.fb.group({

        certificates:
          this.fb.array([])

      });

  }


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  ngOnInit(): void {

    console.log(
      'Certificates page initialized'
    );


    // Add first certificate row

    this.addCertificate();


    // Load student's requests

    this.loadMyRequests();

  }


  // =====================================================
  // FORM ARRAY GETTER
  // =====================================================

  get certificates(): FormArray {

    return this.certificateForm
      .get('certificates') as FormArray;

  }


  // =====================================================
  // CREATE CERTIFICATE ROW
  // =====================================================

  createCertificateRow(): FormGroup {

    return this.fb.group({

      certificateType: [
        '',
        Validators.required
      ],

      reason: [
        '',
        [
          Validators.required,
          Validators.minLength(5)
        ]
      ],

      copies: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(5)
        ]
      ]

    });

  }


  // =====================================================
  // ADD CERTIFICATE
  // =====================================================

  addCertificate(): void {

    // Maximum 3 supported types

    if (
      this.certificates.length >=
      this.certificateTypes.length
    ) {

      this.errorMessage =
        'You cannot add more certificate types.';

      return;

    }


    this.errorMessage = '';

    this.certificates.push(
      this.createCertificateRow()
    );

  }


  // =====================================================
  // REMOVE CERTIFICATE
  // =====================================================

  removeCertificate(
    index: number
  ): void {

    // Keep at least one row

    if (
      this.certificates.length === 1
    ) {

      this.errorMessage =
        'At least one certificate is required.';

      return;

    }


    this.errorMessage = '';

    this.certificates.removeAt(index);

  }


  // =====================================================
  // GET SELECTED TYPES
  // =====================================================

 getSelectedTypes(): CertificateType[] {

  return this.certificates.controls
    .map(control =>
      control.get('certificateType')?.value
    )
    .filter(value => value !== null && value !== '');

}


  // =====================================================
  // CHECK DUPLICATE TYPE
  // =====================================================

  isDuplicateType(
    index: number
  ): boolean {

    const currentType =
      this.certificates
        .at(index)
        .get('certificateType')
        ?.value;


    if (!currentType) {

      return false;

    }


    return this.certificates.controls
      .some((control, currentIndex) => {

        if (
          currentIndex === index
        ) {

          return false;

        }


        return control
          .get('certificateType')
          ?.value === currentType;

      });

  }


  // =====================================================
  // AVAILABLE TYPES FOR ROW
  // =====================================================

  getAvailableTypes(
    index: number
  ): CertificateType[] {

    const selectedTypes =
      this.certificates.controls
        .map((control, currentIndex) => {

          if (
            currentIndex === index
          ) {

            return null;

          }

          return control
            .get('certificateType')
            ?.value;

        })
        .filter(value => value);


    return this.certificateTypes.filter(
      type =>
        !selectedTypes.includes(type)
    );

  }


  // =====================================================
  // LOAD MY REQUESTS
  // =====================================================

  loadMyRequests(): void {

    const storedStudentId =
      localStorage.getItem(
        'studentId'
      );


    console.log(
      'Stored Student ID:',
      storedStudentId
    );


    if (!storedStudentId) {

      this.requests = [];

      this.requestsLoading = false;

      return;

    }


    const studentId =
      Number(storedStudentId);


    if (!studentId) {

      this.requests = [];

      this.requestsLoading = false;

      return;

    }


    this.requestsLoading = true;


    this.certificateService
  .getMyRequests()
      .pipe(

        finalize(() => {

          this.requestsLoading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (data) => {

          console.log(
            'My certificate requests:',
            data
          );


          this.requests =
            Array.isArray(data)
              ? data
              : [];

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error) => {

          console.error(
            'Failed to load certificate requests:',
            error
          );


          this.requests = [];


          if (
            error.status !== 404
          ) {

            this.errorMessage =
              'Unable to load your certificate requests.';

          }

        }

      });

  }


  // =====================================================
  // SUBMIT CERTIFICATE REQUESTS
  // =====================================================

  submitRequests(): void {

    this.errorMessage = '';

    this.successMessage = '';


    // ===================================================
    // FORM VALIDATION
    // ===================================================

    if (
      this.certificateForm.invalid
    ) {

      this.certificateForm.markAllAsTouched();

      this.errorMessage =
        'Please complete all certificate details correctly.';

      return;

    }


    // ===================================================
    // DUPLICATE VALIDATION
    // ===================================================

    for (
      let i = 0;
      i < this.certificates.length;
      i++
    ) {

      if (
        this.isDuplicateType(i)
      ) {

        this.errorMessage =
          'The same certificate type cannot be requested twice.';

        return;

      }

    }


    // ===================================================
    // PREVENT DOUBLE SUBMISSION
    // ===================================================

    if (this.submitting) {

      return;

    }


    this.submitting = true;


    // ===================================================
    // BUILD REQUESTS
    // ===================================================

const requests =
  this.certificates.controls.map(
    control => ({

      type:
        Number(
          control.get('certificateType')?.value
        ),

      reason:
        control.get('reason')?.value.trim()

    })
  );


    console.log(
      'Certificate requests:',
      requests
    );


    // ===================================================
    // SEND REQUESTS
    // ===================================================

    const apiRequests =
      requests.map(request =>
        this.certificateService
          .createRequest(request)
      );


    forkJoin(apiRequests)
      .pipe(

        finalize(() => {

          this.submitting = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (responses) => {

          console.log(
            'Certificate requests submitted:',
            responses
          );


          this.errorMessage = '';

          this.successMessage =
            'Certificate request submitted successfully.';


          // ---------------------------------------------
          // RESET FORM
          // ---------------------------------------------

          this.certificateForm =
            this.fb.group({

              certificates:
                this.fb.array([])

            });


          this.addCertificate();


          // ---------------------------------------------
          // REFRESH HISTORY
          // ---------------------------------------------

          this.loadMyRequests();


          this.cdr.detectChanges();


          // ---------------------------------------------
          // HIDE SUCCESS MESSAGE
          // ---------------------------------------------

          setTimeout(() => {

            this.successMessage = '';

            this.cdr.detectChanges();

          }, 5000);

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error) => {

          console.error(
            'Certificate request failed:',
            error
          );


          this.successMessage = '';


          // 400

          if (
            error.status === 400
          ) {

            this.errorMessage =
              error.error?.message ||
              error.error?.title ||
              'Invalid certificate request.';

          }


          // 401

          else if (
            error.status === 401
          ) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }


          // 403

          else if (
            error.status === 403
          ) {

            this.errorMessage =
              'You are not allowed to submit this request.';

          }


          // 404

          else if (
            error.status === 404
          ) {

            this.errorMessage =
              'Certificate service could not find the requested resource.';

          }


          // 409

          else if (
            error.status === 409
          ) {

            this.errorMessage =
              error.error?.message ||
              'A pending request already exists for this certificate type.';

            this.loadMyRequests();

          }


          // OTHER

          else {

            this.errorMessage =
              'Unable to submit certificate request.';

          }


          this.cdr.detectChanges();

        }

      });

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

      case 'Approved':
        return 'status-approved';

      case 'Rejected':
        return 'status-rejected';

      case 'ReadyForCollection':
        return 'status-ready';

      default:
        return 'status-default';

    }

  }


  // =====================================================
  // DISPLAY STATUS
  // =====================================================

  getStatusLabel(
    status: string
  ): string {

    switch (status) {

      case 'ReadyForCollection':
        return 'Ready for Collection';

      case 'InProgress':
        return 'In Progress';

      default:
        return status;

    }

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refreshRequests(): void {

    this.errorMessage = '';

    this.successMessage = '';

    this.loadMyRequests();

  }

}