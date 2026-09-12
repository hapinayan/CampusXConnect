// =====================================================
// COMPLAINT STATUS
// =====================================================

export type ComplaintStatus =
  | 'Pending'
  | 'InProgress'
  | 'Resolved';


// =====================================================
// COMPLAINT CATEGORY
// =====================================================

export interface ComplaintCategory {

  id: number;

  name: string;

  description?: string;

}


// =====================================================
// COMPLAINT
// =====================================================

export interface Complaint {

  id: number;

  studentId: number;

  categoryId: number;

  categoryName?: string;

  description: string;

  status: ComplaintStatus;

  resolutionNote?: string;

  createdAt: string;

  updatedAt?: string;

}


// =====================================================
// CREATE COMPLAINT
// =====================================================

export interface CreateComplaint {

  categoryId: number;

  description: string;

}


// =====================================================
// CREATE COMPLAINT CATEGORY
// =====================================================

export interface CreateComplaintCategory {

  name: string;

  description?: string;

}


// =====================================================
// UPDATE COMPLAINT STATUS
// =====================================================

export interface UpdateComplaintStatus {

  status: ComplaintStatus;

  resolutionNote?: string;

}