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
// =====================================================

export type CertificateStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'ReadyForCollection';


// =====================================================
// CERTIFICATE REQUEST
// =====================================================

export interface CertificateRequest {

  id: number;

  studentId: number;

  studentName?: string;

  type: CertificateType;

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