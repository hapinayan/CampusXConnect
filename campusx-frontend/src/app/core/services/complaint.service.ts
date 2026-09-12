import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Complaint,
  ComplaintCategory,
  CreateComplaint,
  UpdateComplaintStatus
} from '../models/complaint';


@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private readonly categoryUrl =
    `${environment.apiUrl}/complaint-categories`;

  private readonly complaintUrl =
    `${environment.apiUrl}/complaints`;


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // GET COMPLAINT CATEGORIES
  // =====================================================

  getCategories(): Observable<ComplaintCategory[]> {

    return this.http.get<ComplaintCategory[]>(
      this.categoryUrl
    );

  }


  // =====================================================
  // GET CATEGORY BY ID
  // Keep for existing student code compatibility
  // =====================================================

  getCategoryById(
    id: number
  ): Observable<ComplaintCategory> {

    return this.http.get<ComplaintCategory>(
      `${this.categoryUrl}/${id}`
    );

  }


  // =====================================================
  // CREATE COMPLAINT
  // =====================================================

  createComplaint(
    data: CreateComplaint
  ): Observable<Complaint> {

    return this.http.post<Complaint>(
      this.complaintUrl,
      data
    );

  }


  // =====================================================
  // GET STUDENT COMPLAINTS
  // =====================================================

  getMyComplaints(
    studentId: number
  ): Observable<Complaint[]> {

    return this.http.get<Complaint[]>(
      `${this.complaintUrl}/student/${studentId}`
    );

  }


  // =====================================================
  // GET COMPLAINT BY ID
  // Keep for existing student code compatibility
  // =====================================================

  getComplaintById(
    id: number
  ): Observable<Complaint> {

    return this.http.get<Complaint>(
      `${this.complaintUrl}/${id}`
    );

  }


  // =====================================================
  // ADMIN - GET ALL COMPLAINTS
  // =====================================================

  getAllComplaints(
    status?: string | number
  ): Observable<Complaint[]> {

    let params = new HttpParams();

    if (
      status !== undefined &&
      status !== null &&
      status !== ''
    ) {

      params = params.set(
        'status',
        status.toString()
      );

    }

    return this.http.get<Complaint[]>(
      this.complaintUrl,
      { params }
    );

  }


  // =====================================================
  // ADMIN - UPDATE COMPLAINT STATUS
  // =====================================================

  updateComplaintStatus(
    id: number,
    data: UpdateComplaintStatus
  ): Observable<Complaint> {

    return this.http.put<Complaint>(
      `${this.complaintUrl}/${id}/status`,
      data
    );

  }

}