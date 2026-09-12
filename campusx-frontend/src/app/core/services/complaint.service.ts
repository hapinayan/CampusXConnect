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

  // =====================================================
  // API URLs
  // =====================================================

  private readonly categoryUrl =
    `${environment.apiUrl}/complaint-categories`;

  private readonly complaintUrl =
    `${environment.apiUrl}/complaints`;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // GET COMPLAINT CATEGORIES
  // GET: api/complaint-categories
  // =====================================================

  getCategories(): Observable<ComplaintCategory[]> {

    return this.http.get<ComplaintCategory[]>(
      this.categoryUrl
    );

  }


  // =====================================================
  // GET CATEGORY BY ID
  // GET: api/complaint-categories/{id}
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
  // POST: api/complaints
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
  // GET MY COMPLAINTS
  // GET: api/complaints/student/{studentId}
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
  // GET: api/complaints/{id}
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
  // GET: api/complaints
  // =====================================================

  getAllComplaints(
    status?: string
  ): Observable<Complaint[]> {

    let params = new HttpParams();

    if (status) {

      params = params.set(
        'status',
        status
      );

    }

    return this.http.get<Complaint[]>(
      this.complaintUrl,
      { params }
    );

  }


  // =====================================================
  // ADMIN - UPDATE COMPLAINT STATUS
  // PUT: api/complaints/{id}/status
  // =====================================================

  updateComplaintStatus(
    id: number,
    data: UpdateComplaintStatus
  ): Observable<Complaint> {

    const statusMap: Record<string, number> = {
      Pending: 0,
      InProgress: 1,
      Resolved: 2
    };


    const body = {

      status:
        statusMap[data.status],

      resolutionNote:
        data.resolutionNote || null

    };


    return this.http.put<Complaint>(
      `${this.complaintUrl}/${id}/status`,
      body
    );

  }

}