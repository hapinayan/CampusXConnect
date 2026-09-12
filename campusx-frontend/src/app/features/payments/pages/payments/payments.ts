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
import { NotificationService } from '../../../../core/services/notification.service';

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
  // STUDENT PROFILE
  // =====================================================

  studentName = 'Student';


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  unreadCount = 0;


  // =====================================================
  // MAIN PAYMENT FORM
  // =====================================================

  paymentForm: FormGroup;


  // =====================================================
  // PAYMENT DETAILS FORM
  // =====================================================

  paymentDetailsForm: FormGroup;


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
  // PAYMENT MODAL
  // =====================================================

  showPaymentModal = false;

  selectedPaymentMethod:
    'card' |
    'bank' = 'card';


  // =====================================================
  // PAYMENT SUMMARY
  // =====================================================

  pendingFeeType = '';

  pendingAmount = 0;


  // =====================================================
  // PROCESSING STATE
  // =====================================================

  paymentProcessing = false;

  processingText =
    'Processing your payment...';


  // =====================================================
  // LAST PAYMENT
  // =====================================================

  lastPayment: PaymentResponse | null = null;


  // =====================================================
  // TRANSACTION DISPLAY
  // =====================================================

  transactionReference = '';

  paidAt: Date | null = null;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private fb: FormBuilder,

    private paymentService: PaymentService,

    private notificationService: NotificationService,

    private cdr: ChangeDetectorRef

  ) {

    // =================================================
    // MAIN FORM
    // =================================================

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


    // =================================================
    // PAYMENT DETAILS
    // =================================================

    this.paymentDetailsForm = this.fb.group({

      cardholderName: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[0-9]{16}$/
          )
        ]
      ],

      expiryDate: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(0[1-9]|1[0-2])\/[0-9]{2}$/
          )
        ]
      ],

      cvv: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[0-9]{3,4}$/
          )
        ]
      ],

      bankReference: [
        ''
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


    this.loadStudentProfile();

    this.loadUnreadNotificationCount();

    this.loadPayments();

  }


  // =====================================================
  // LOAD STUDENT PROFILE
  // =====================================================

  loadStudentProfile(): void {

    try {

      // ===============================================
      // 1. STUDENT OBJECT
      // ===============================================

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


      // ===============================================
      // 2. FULL NAME
      // ===============================================

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


      // ===============================================
      // 3. STUDENT NAME
      // ===============================================

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


      // ===============================================
      // FALLBACK
      // ===============================================

      this.studentName = 'Student';


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


      this.studentName = 'Student';


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
      'Payments notification Student ID:',
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

          if (
            !Array.isArray(
              notifications
            )
          ) {

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
            'Payments unread notifications:',
            this.unreadCount
          );


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load Payments notification count:',
            error
          );


          this.unreadCount = 0;


          this.cdr.detectChanges();

        }

      });

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

        next: (data) => {

          console.log(
            'My payments:',
            data
          );


          this.payments =
            Array.isArray(data)
              ? data
              : [];


          this.cdr.detectChanges();

        },


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


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CONTINUE TO PAYMENT
  // =====================================================

  makePayment(): void {

    this.errorMessage = '';

    this.successMessage = '';

    this.lastPayment = null;


    if (
      this.submitting ||
      this.paymentProcessing
    ) {

      return;

    }


    if (
      this.paymentForm.invalid
    ) {

      this.paymentForm
        .markAllAsTouched();


      this.errorMessage =
        'Please enter a valid fee type and amount.';


      this.cdr.detectChanges();

      return;

    }


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


    this.pendingFeeType =
      feeType;


    this.pendingAmount =
      amount;


    this.selectedPaymentMethod =
      'card';


    this.paymentDetailsForm.reset({

      cardholderName:
        this.studentName !== 'Student'
          ? this.studentName
          : '',

      cardNumber: '',

      expiryDate: '',

      cvv: '',

      bankReference: ''

    });


    this.configurePaymentMethodValidation();


    this.showPaymentModal = true;


    console.log(
      'Opening payment confirmation:',
      {
        feeType:
          this.pendingFeeType,

        amount:
          this.pendingAmount
      }
    );


    this.cdr.detectChanges();

  }


  // =====================================================
  // SELECT PAYMENT METHOD
  // =====================================================

  selectPaymentMethod(
    method: 'card' | 'bank'
  ): void {

    this.selectedPaymentMethod =
      method;


    this.configurePaymentMethodValidation();


    this.cdr.detectChanges();

  }


  // =====================================================
  // CONFIGURE PAYMENT METHOD VALIDATION
  // =====================================================

  private configurePaymentMethodValidation(): void {

    const cardholderName =
      this.paymentDetailsForm
        .get('cardholderName');

    const cardNumber =
      this.paymentDetailsForm
        .get('cardNumber');

    const expiryDate =
      this.paymentDetailsForm
        .get('expiryDate');

    const cvv =
      this.paymentDetailsForm
        .get('cvv');

    const bankReference =
      this.paymentDetailsForm
        .get('bankReference');


    if (
      this.selectedPaymentMethod ===
      'card'
    ) {

      cardholderName?.setValidators([
        Validators.required,
        Validators.minLength(3)
      ]);


      cardNumber?.setValidators([
        Validators.required,
        Validators.pattern(
          /^[0-9]{16}$/
        )
      ]);


      expiryDate?.setValidators([
        Validators.required,
        Validators.pattern(
          /^(0[1-9]|1[0-2])\/[0-9]{2}$/
        )
      ]);


      cvv?.setValidators([
        Validators.required,
        Validators.pattern(
          /^[0-9]{3,4}$/
        )
      ]);


      bankReference?.clearValidators();

    }

    else {

      cardholderName?.clearValidators();

      cardNumber?.clearValidators();

      expiryDate?.clearValidators();

      cvv?.clearValidators();


      bankReference?.setValidators([
        Validators.required,
        Validators.minLength(4)
      ]);

    }


    cardholderName
      ?.updateValueAndValidity();

    cardNumber
      ?.updateValueAndValidity();

    expiryDate
      ?.updateValueAndValidity();

    cvv
      ?.updateValueAndValidity();

    bankReference
      ?.updateValueAndValidity();

  }


  // =====================================================
  // FORMAT CARD NUMBER INPUT
  // =====================================================

  formatCardNumberInput(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    const digits =
      input.value
        .replace(
          /\D/g,
          ''
        )
        .slice(
          0,
          16
        );


    this.paymentDetailsForm
      .get('cardNumber')
      ?.setValue(
        digits,
        {
          emitEvent: false
        }
      );


    input.value =
      digits.replace(
        /(\d{4})(?=\d)/g,
        '$1 '
      );

  }


  // =====================================================
  // FORMAT EXPIRY INPUT
  // =====================================================

  formatExpiryInput(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    let value =
      input.value
        .replace(
          /\D/g,
          ''
        )
        .slice(
          0,
          4
        );


    if (
      value.length >= 3
    ) {

      value =
        `${value.slice(0, 2)}/${value.slice(2)}`;

    }


    this.paymentDetailsForm
      .get('expiryDate')
      ?.setValue(
        value,
        {
          emitEvent: false
        }
      );


    input.value =
      value;

  }


  // =====================================================
  // CLOSE PAYMENT MODAL
  // =====================================================

  closePaymentModal(): void {

    if (
      this.paymentProcessing
    ) {

      return;

    }


    this.showPaymentModal = false;


    this.paymentDetailsForm.reset();


    this.cdr.detectChanges();

  }


  // =====================================================
  // CONFIRM PAYMENT
  // =====================================================

  confirmPayment(): void {

    this.errorMessage = '';

    this.successMessage = '';


    if (
      this.paymentProcessing ||
      this.submitting
    ) {

      return;

    }


    this.configurePaymentMethodValidation();


    if (
      this.paymentDetailsForm.invalid
    ) {

      this.paymentDetailsForm
        .markAllAsTouched();


      this.cdr.detectChanges();

      return;

    }


    if (
      !this.pendingFeeType ||
      this.pendingAmount <= 0
    ) {

      this.errorMessage =
        'Payment information is invalid. Please try again.';


      this.showPaymentModal = false;


      this.cdr.detectChanges();

      return;

    }


    this.paymentProcessing = true;

    this.submitting = true;


    this.processingText =
      'Processing your secure payment...';


    console.log(
      'Confirming payment:',
      {
        feeType:
          this.pendingFeeType,

        amount:
          this.pendingAmount,

        method:
          this.selectedPaymentMethod
      }
    );


    this.paymentService

      .pay(
        this.pendingFeeType,
        this.pendingAmount
      )

      .pipe(

        finalize(() => {

          this.paymentProcessing = false;

          this.submitting = false;


          this.cdr.detectChanges();

        })

      )

      .subscribe({

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


          this.transactionReference =
            this.createTransactionReference();


          this.paidAt =
            new Date();


          this.showPaymentModal =
            false;


          this.paymentDetailsForm
            .reset();


          this.paymentForm.reset({

            feeType: '',

            amount: null

          });


          this.pendingFeeType = '';

          this.pendingAmount = 0;


          this.loadPayments();

          this.loadUnreadNotificationCount();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Payment failed:',
            error
          );


          this.successMessage = '';

          this.lastPayment = null;


          if (
            error.status === 400
          ) {

            this.errorMessage =
              error.error?.message ||
              error.error?.title ||
              'Invalid payment request.';

          }

          else if (
            error.status === 401
          ) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }

          else if (
            error.status === 403
          ) {

            this.errorMessage =
              'You are not allowed to make this payment.';

          }

          else if (
            error.status === 404
          ) {

            this.errorMessage =
              'Payment service could not find the requested resource.';

          }

          else if (
            error.status === 409
          ) {

            this.errorMessage =
              error.error?.message ||
              'This fee has already been paid.';


            this.loadPayments();

          }

          else {

            this.errorMessage =
              error.error?.message ||
              'Unable to complete payment. Please try again.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CREATE DISPLAY TRANSACTION REFERENCE
  // =====================================================

  private createTransactionReference(): string {

    const now =
      new Date();


    const datePart =
      `${now.getFullYear()}${String(
        now.getMonth() + 1
      ).padStart(
        2,
        '0'
      )}${String(
        now.getDate()
      ).padStart(
        2,
        '0'
      )}`;


    const randomPart =
      Math.floor(
        100000 +
        Math.random() * 900000
      );


    return `PAY-${datePart}-${randomPart}`;

  }


  // =====================================================
  // GET PAYMENT METHOD LABEL
  // =====================================================

  getPaymentMethodLabel(): string {

    return this.selectedPaymentMethod ===
      'card'
      ? 'Card Payment'
      : 'Bank Transfer';

  }


  // =====================================================
  // GET MASKED CARD NUMBER
  // =====================================================

  getMaskedCardNumber(): string {

    const cardNumber =
      String(
        this.paymentDetailsForm
          .get('cardNumber')
          ?.value || ''
      );


    if (
      cardNumber.length < 4
    ) {

      return '••••';

    }


    return `•••• •••• •••• ${cardNumber.slice(-4)}`;

  }


  // =====================================================
  // REFRESH PAYMENT HISTORY
  // =====================================================

  refreshPayments(): void {

    this.errorMessage = '';

    this.successMessage = '';


    this.loadPayments();

    this.loadUnreadNotificationCount();

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