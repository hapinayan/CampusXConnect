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

  // Backend response may return:
  // "Enrollment", "Academic", "Character", "Other"
  // while request uses numeric enum values.
  type: CertificateType | string;

  reason: string;

  status: CertificateStatus;

  requestedAt: string;

  updatedAt?: string | null;

}


// =====================================================
// CREATE CERTIFICATE REQUEST
// POST /api/certificate-requests
// =====================================================

export interface CreateCertificateRequest {

  type: CertificateType;

  reason: string;

}


// =====================================================
// UPDATE CERTIFICATE STATUS
// PUT /api/certificate-requests/{id}/status
// =====================================================

export interface UpdateCertificateStatus {

  status: number;

}