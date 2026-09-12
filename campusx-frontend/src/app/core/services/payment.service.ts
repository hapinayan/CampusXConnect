import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Payment,
  PaymentResponse
} from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly paymentUrl =
    `${environment.apiUrl}/FeePayment`;

  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // STUDENT - GET MY PAYMENT HISTORY
  // =====================================================

  getMyPayments(): Observable<Payment[]> {

    return this.http.get<Payment[]>(
      `${this.paymentUrl}/my-payments`
    );

  }


  // =====================================================
  // STUDENT - MAKE PAYMENT
  // =====================================================

  pay(
    feeType: string,
    amount: number
  ): Observable<PaymentResponse> {

    const params = new HttpParams()
      .set(
        'feeType',
        feeType
      )
      .set(
        'amount',
        amount.toString()
      );

    return this.http.post<PaymentResponse>(
      `${this.paymentUrl}/pay`,
      null,
      {
        params
      }
    );

  }


  // =====================================================
  // ADMIN - GET ALL PAYMENTS
  // GET: api/FeePayment/admin/all
  // =====================================================

  getAllPayments(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.paymentUrl}/admin/all`
    );

  }

}