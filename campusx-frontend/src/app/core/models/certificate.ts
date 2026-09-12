// =====================================================
// CERTIFICATE TYPE
// =====================================================

export enum CertificateType {
  Enrollment = 0,
  Academic = 1,
  Character = 2,
  Other = 3
}


// =====================================================
// CERTIFICATE STATUS
// Backend:
// Pending  = 0
// Approved = 1
// Rejected = 2
// Issued   = 3
//
// UI-la "Issued" status-ai
// "Ready for Collection" endu display pannuvom.
// =====================================================

export type CertificateStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Issued';


// =====================================================
// CERTIFICATE REQUEST
// =====================================================

export interface CertificateRequest {
  id: number;
  studentId: number;
  studentName?: string;
  type: CertificateType | string;
  reason: string;
  status: CertificateStatus;
  requestedAt: string;
  updatedAt?: string;
}


// =====================================================
// CREATE CERTIFICATE REQUEST
// =====================================================

export interface CreateCertificateRequest {
  type: CertificateType;
  reason: string;
}