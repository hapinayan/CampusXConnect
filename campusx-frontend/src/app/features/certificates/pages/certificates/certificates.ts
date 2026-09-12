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


    // Load student's certificate requests

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

      ]

    });

  }


  // =====================================================
  // ADD CERTIFICATE
  // =====================================================

  addCertificate(): void {

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
  // NORMALIZE CERTIFICATE TYPE
  // =====================================================

  private normalizeCertificateType(
    value: unknown
  ): CertificateType | null {

    if (

      value === null ||
      value === undefined ||
      value === ''

    ) {

      return null;

    }


    // Backend may return enum as number

    if (

      typeof value === 'number'

    ) {

      if (

        value >= CertificateType.Enrollment &&
        value <= CertificateType.Other

      ) {

        return value as CertificateType;

      }

      return null;

    }


    // Backend may return enum as string

    switch (

      String(value).toLowerCase()

    ) {

      case '0':
      case 'enrollment':

        return CertificateType.Enrollment;


      case '1':
      case 'academic':

        return CertificateType.Academic;


      case '2':
      case 'character':

        return CertificateType.Character;


      case '3':
      case 'other':

        return CertificateType.Other;


      default:

        return null;

    }

  }


  // =====================================================
  // GET SELECTED TYPES
  // =====================================================

  getSelectedTypes(): CertificateType[] {

    return this.certificates.controls

      .map(control =>

        this.normalizeCertificateType(

          control
            .get('certificateType')
            ?.value

        )

      )

      .filter(

        (value): value is CertificateType =>

          value !== null

      );

  }


  // =====================================================
  // CHECK DUPLICATE TYPE
  // =====================================================

  isDuplicateType(
    index: number
  ): boolean {

    const currentType =

      this.normalizeCertificateType(

        this.certificates
          .at(index)
          .get('certificateType')
          ?.value

      );


    if (

      currentType === null

    ) {

      return false;

    }


    return this.certificates.controls

      .some(

        (control, currentIndex) => {

          if (

            currentIndex === index

          ) {

            return false;

          }


          const otherType =

            this.normalizeCertificateType(

              control
                .get('certificateType')
                ?.value

            );


          return otherType === currentType;

        }

      );

  }


  // =====================================================
  // AVAILABLE TYPES FOR ROW
  // =====================================================

  getAvailableTypes(
    index: number
  ): CertificateType[] {

    const selectedTypes =

      this.certificates.controls

        .map(

          (control, currentIndex) => {

            if (

              currentIndex === index

            ) {

              return null;

            }


            return this.normalizeCertificateType(

              control
                .get('certificateType')
                ?.value

            );

          }

        )

        .filter(

          (value): value is CertificateType =>

            value !== null

        );


    return this.certificateTypes.filter(

      type =>

        !selectedTypes.includes(type)

    );

  }


  // =====================================================
  // CERTIFICATE TYPE LABEL
  // =====================================================

  getCertificateTypeLabel(
    type: CertificateType | string | number
  ): string {

    switch (

      this.normalizeCertificateType(type)

    ) {

      case CertificateType.Enrollment:

        return 'Enrollment Certificate';


      case CertificateType.Academic:

        return 'Academic Certificate';


      case CertificateType.Character:

        return 'Character Certificate';


      case CertificateType.Other:

        return 'Other Certificate';


      default:

        return 'Certificate';

    }

  }


  // =====================================================
  // LOAD MY REQUESTS
  // =====================================================

  loadMyRequests(): void {

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

        // =================================================
        // SUCCESS
        // =================================================

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


        // =================================================
        // ERROR
        // =================================================

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

              error.error?.message ||

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
    // PREVENT DOUBLE SUBMISSION
    // ===================================================

    if (

      this.submitting

    ) {

      return;

    }


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
    // BUILD REQUESTS
    // ===================================================

    const requests =

      this.certificates.controls

        .map(control => {

          const type =

            this.normalizeCertificateType(

              control
                .get('certificateType')
                ?.value

            );


          const reason =

            String(

              control
                .get('reason')
                ?.value ?? ''

            ).trim();


          return {

            type,

            reason

          };

        });


    // ===================================================
    // EXTRA VALIDATION
    // ===================================================

    const invalidRequest =

      requests.some(

        request =>

          request.type === null ||

          request.reason.length < 5

      );


    if (

      invalidRequest

    ) {

      this.certificateForm.markAllAsTouched();

      this.errorMessage =

        'Please complete all certificate details correctly.';

      return;

    }


    console.log(

      'Certificate requests:',

      requests

    );


    // ===================================================
    // START SUBMISSION
    // ===================================================

    this.submitting = true;


    // ===================================================
    // SEND REQUESTS
    // ===================================================

    const apiRequests =

      requests.map(request =>

        this.certificateService

          .createRequest({

            type: request.type as CertificateType,

            reason: request.reason

          })

      );


    forkJoin(apiRequests)

      .pipe(

        finalize(() => {

          this.submitting = false;

          this.cdr.detectChanges();

        })

      )

      .subscribe({

        // =================================================
        // SUCCESS
        // =================================================

        next: (responses) => {

          console.log(

            'Certificate requests submitted:',

            responses

          );


          this.errorMessage = '';

          this.successMessage =

            'Certificate request submitted successfully.';


          // ===============================================
          // RESET FORM
          // ===============================================

          this.certificateForm =

            this.fb.group({

              certificates:

                this.fb.array([])

            });


          this.addCertificate();


          // ===============================================
          // REFRESH HISTORY
          // ===============================================

          this.loadMyRequests();


          this.cdr.detectChanges();


          // ===============================================
          // HIDE SUCCESS MESSAGE
          // ===============================================

          setTimeout(() => {

            this.successMessage = '';

            this.cdr.detectChanges();

          }, 5000);

        },


        // =================================================
        // ERROR
        // =================================================

        error: (error) => {

          console.error(

            'Certificate request failed:',

            error

          );


          this.successMessage = '';


          // ===============================================
          // 400
          // ===============================================

          if (

            error.status === 400

          ) {

            this.errorMessage =

              error.error?.message ||

              error.error?.title ||

              'Invalid certificate request.';

          }


          // ===============================================
          // 401
          // ===============================================

          else if (

            error.status === 401

          ) {

            this.errorMessage =

              'Your session has expired. Please login again.';

          }


          // ===============================================
          // 403
          // ===============================================

          else if (

            error.status === 403

          ) {

            this.errorMessage =

              'You are not allowed to submit this request.';

          }


          // ===============================================
          // 404
          // ===============================================

          else if (

            error.status === 404

          ) {

            this.errorMessage =

              'Certificate service could not find the requested resource.';

          }


          // ===============================================
          // 409
          // ===============================================

          else if (

            error.status === 409

          ) {

            this.errorMessage =

              error.error?.message ||

              'A pending request already exists for this certificate type.';

          }


          // ===============================================
          // OTHER
          // ===============================================

          else {

            this.errorMessage =

              error.error?.message ||

              'Unable to submit certificate request.';

          }


          // ===============================================
          // REFRESH HISTORY
          // ===============================================

          this.loadMyRequests();


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

    switch (

      status

    ) {

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

    switch (

      status

    ) {

      case 'ReadyForCollection':

        return 'Ready for Collection';


      case 'InProgress':

        return 'In Progress';


      default:

        return status;

    }

  }


  // =====================================================
  // REFRESH REQUESTS
  // =====================================================

  refreshRequests(): void {

    this.errorMessage = '';

    this.successMessage = '';

    this.loadMyRequests();

  }

}