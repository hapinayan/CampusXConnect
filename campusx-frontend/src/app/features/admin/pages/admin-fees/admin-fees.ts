import {
  Component,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  PaymentService
} from '../../../../core/services/payment.service';

@Component({
  selector: 'app-admin-fees',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './admin-fees.html',
  styleUrl: './admin-fees.css'
})
export class AdminFees implements OnInit {

  payments = signal<any[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');


  // =========================
  // COUNTS
  // =========================

  totalPayments = computed(() =>
    this.payments().length
  );


  paidPayments = computed(() =>
    this.payments().filter(
      payment =>
        payment.status === 'Paid'
    ).length
  );


  totalAmount = computed(() =>
    this.payments().reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    )
  );


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private paymentService: PaymentService
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.loadPayments();

  }


  // =========================
  // LOAD ALL PAYMENTS
  // =========================

  loadPayments(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');


    this.paymentService
      .getAllPayments()
      .subscribe({

        next: (payments) => {

          this.payments.set(
            payments
          );

          this.isLoading.set(false);

          console.log(
            'Admin payments loaded:',
            payments
          );

        },


        error: (error) => {

          console.error(
            'Error loading admin payments:',
            error
          );

          this.errorMessage.set(
            'Unable to load payment records.'
          );

          this.isLoading.set(false);

        }

      });

  }

}