import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RouterLink } from '@angular/router';

import { finalize } from 'rxjs/operators';

import { PaymentService } from '../../../../core/services/payment.service';

import {
  Payment,
  PaymentResponse
} from '../../../../core/models/payment';


@Component({
  selector: 'app-payments',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './payments.html',

  styleUrl: './payments.css'
})
export class Payments implements OnInit {

  // =====================================================
  // PAYMENT FORM
  // =====================================================

  paymentForm: FormGroup;


  // =====================================================
  // PAYMENT HISTORY
  // =====================================================

  payments: Payment[] = [];

  paymentsLoading = true;


  // =====================================================
  // UI STATES
  // =====================================================

  submitting = false;

  errorMessage = '';

  successMessage = '';


  // =====================================================
  // LAST PAYMENT
  // =====================================================

  lastPayment: PaymentResponse | null = null;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private fb: FormBuilder,

    private paymentService: PaymentService,

    private cdr: ChangeDetectorRef

  ) {

    this.paymentForm = this.fb.group({

      feeType: [
        '',
        [
          Validators.required
        ]
      ],

      amount: [
        null,
        [
          Validators.required,
          Validators.min(1)
        ]
      ]

    });

  }


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  ngOnInit(): void {

    console.log(
      'Payments page initialized'
    );

    this.loadPayments();

  }


  // =====================================================
  // LOAD PAYMENT HISTORY
  // =====================================================

  loadPayments(): void {

    this.paymentsLoading = true;

    this.paymentService
      .getMyPayments()

      .pipe(

        finalize(() => {

          this.paymentsLoading = false;

          this.cdr.detectChanges();

        })

      )

      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (data) => {

          console.log(
            'My payments:',
            data
          );

          this.payments =
            Array.isArray(data)
              ? data
              : [];

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error) => {

          console.error(
            'Failed to load payments:',
            error
          );

          this.payments = [];

          if (
            error.status !== 404
          ) {

            this.errorMessage =
              error.error?.message ||
              'Unable to load payment history.';

          }

        }

      });

  }


  // =====================================================
  // MAKE PAYMENT
  // =====================================================

  makePayment(): void {

    this.errorMessage = '';

    this.successMessage = '';

    this.lastPayment = null;


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
      this.paymentForm.invalid
    ) {

      this.paymentForm.markAllAsTouched();

      this.errorMessage =
        'Please enter a valid fee type and amount.';

      return;

    }


    // ===================================================
    // GET FORM VALUES
    // ===================================================

    const feeType =
      String(
        this.paymentForm
          .get('feeType')
          ?.value ?? ''
      ).trim();


    const amount =
      Number(
        this.paymentForm
          .get('amount')
          ?.value
      );


    if (
      !feeType ||
      !amount ||
      amount <= 0
    ) {

      this.errorMessage =
        'Please enter a valid fee type and amount.';

      return;

    }


    // ===================================================
    // START PAYMENT
    // ===================================================

    this.submitting = true;


    console.log(
      'Making payment:',
      {
        feeType,
        amount
      }
    );


    // ===================================================
    // CALL BACKEND
    // ===================================================

    this.paymentService

      .pay(
        feeType,
        amount
      )

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

        next: (response) => {

          console.log(
            'Payment successful:',
            response
          );


          this.errorMessage = '';

          this.successMessage =
            response.message ||
            'Payment completed successfully.';


          this.lastPayment =
            response;


          // =============================================
          // RESET FORM
          // =============================================

          this.paymentForm.reset({

            feeType: '',

            amount: null

          });


          // =============================================
          // REFRESH HISTORY
          // =============================================

          this.loadPayments();


          this.cdr.detectChanges();


          // =============================================
          // HIDE SUCCESS MESSAGE
          // =============================================

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
            'Payment failed:',
            error
          );


          this.successMessage = '';

          this.lastPayment = null;


          // =============================================
          // 400
          // =============================================

          if (
            error.status === 400
          ) {

            this.errorMessage =
              error.error?.message ||
              error.error?.title ||
              'Invalid payment request.';

          }


          // =============================================
          // 401
          // =============================================

          else if (
            error.status === 401
          ) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }


          // =============================================
          // 403
          // =============================================

          else if (
            error.status === 403
          ) {

            this.errorMessage =
              'You are not allowed to make this payment.';

          }


          // =============================================
          // 404
          // =============================================

          else if (
            error.status === 404
          ) {

            this.errorMessage =
              'Payment service could not find the requested resource.';

          }


          // =============================================
          // 409
          // =============================================

          else if (
            error.status === 409
          ) {

            this.errorMessage =
              error.error?.message ||
              'This fee has already been paid.';

            this.loadPayments();

          }


          // =============================================
          // OTHER ERRORS
          // =============================================

          else {

            this.errorMessage =
              error.error?.message ||
              'Unable to complete payment.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // REFRESH PAYMENT HISTORY
  // =====================================================

  refreshPayments(): void {

    this.errorMessage = '';

    this.successMessage = '';

    this.loadPayments();

  }


  // =====================================================
  // PAYMENT STATUS CLASS
  // =====================================================

  getPaymentStatusClass(
    status: string
  ): string {

    switch (
      status
    ) {

      case 'Paid':

        return 'status-paid';


      case 'Pending':

        return 'status-pending';


      case 'Failed':

        return 'status-failed';


      default:

        return 'status-default';

    }

  }


  // =====================================================
  // PAYMENT STATUS LABEL
  // =====================================================

  getPaymentStatusLabel(
    status: string
  ): string {

    switch (
      status
    ) {

      case 'Paid':

        return 'Paid';


      case 'Pending':

        return 'Pending';


      case 'Failed':

        return 'Failed';


      default:

        return status;

    }

  }


  // =====================================================
  // FORMAT AMOUNT
  // =====================================================

  formatAmount(
    amount: number
  ): string {

    return new Intl.NumberFormat(
      'en-LK',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    ).format(amount);

  }


  // =====================================================
  // GET RECEIPT
  // =====================================================

  getReceiptNumber(
    payment: Payment
  ): string {

    return payment.receiptNumber ||
      'Not available';

  }

}