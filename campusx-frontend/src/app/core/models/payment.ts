export interface Payment {
  id: number;
  feeType: string;
  amount: number;
  status: string;
  paidAt: string;
  receiptNumber: string;
}

export interface PaymentResponse {
  message: string;
  id: number;
  feeType: string;
  amount: number;
  status: string;
  paidAt: string;
  receiptNumber: string;
}

export interface CreatePaymentRequest {
  feeType: string;
  amount: number;
}