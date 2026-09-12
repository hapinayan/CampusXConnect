import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  CertificateRequest,
  CertificateStatus,
  CreateCertificateRequest
} from '../models/certificate';


@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  // =====================================================
  // API URL
  // =====================================================

  private readonly certificateUrl =
    `${environment.apiUrl}/certificate-requests`;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // STUDENT - CREATE CERTIFICATE REQUEST
  // POST: api/certificate-requests
  // =====================================================

  createRequest(
    data: CreateCertificateRequest
  ): Observable<CertificateRequest> {

    return this.http.post<CertificateRequest>(
      this.certificateUrl,
      data
    );

  }


  // =====================================================
  // STUDENT - GET MY CERTIFICATE REQUESTS
  // GET: api/certificate-requests/my
  // =====================================================

  getMyRequests():
    Observable<CertificateRequest[]> {

    return this.http.get<CertificateRequest[]>(
      `${this.certificateUrl}/my`
    );

  }


  // =====================================================
  // GET CERTIFICATE REQUEST BY ID
  // GET: api/certificate-requests/{id}
  // =====================================================

  getRequestById(
    id: number
  ): Observable<CertificateRequest> {

    return this.http.get<CertificateRequest>(
      `${this.certificateUrl}/${id}`
    );

  }


  // =====================================================
  // CANCEL CERTIFICATE REQUEST
  // DELETE: api/certificate-requests/{id}
  // =====================================================

  cancelRequest(
    id: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.certificateUrl}/${id}`
    );

  }


  // =====================================================
  // ADMIN - GET ALL CERTIFICATE REQUESTS
  // GET: api/certificate-requests/admin
  // =====================================================

  getAllRequests(
    status?: CertificateStatus
  ): Observable<CertificateRequest[]> {

    let params = new HttpParams();

    if (status) {

      const statusMap: Record<string, number> = {
        Pending: 0,
        Approved: 1,
        Rejected: 2,
        Issued: 3,
        ReadyForCollection: 3
      };

      const statusValue =
        statusMap[status];

      if (statusValue !== undefined) {
        params = params.set(
          'status',
          statusValue.toString()
        );
      }

    }


    return this.http.get<CertificateRequest[]>(
      `${this.certificateUrl}/admin`,
      { params }
    );

  }


  // =====================================================
  // ADMIN - UPDATE CERTIFICATE STATUS
  // PUT: api/certificate-requests/{id}/status
  //
  // Backend:
  // Pending  = 0
  // Approved = 1
  // Rejected = 2
  // Issued   = 3
  // =====================================================

  updateStatus(
    id: number,
    status: CertificateStatus,
    rejectionReason?: string
  ): Observable<CertificateRequest> {

    const statusMap: Record<string, number> = {
      Pending: 0,
      Approved: 1,
      Rejected: 2,
      Issued: 3,
      ReadyForCollection: 3
    };


    const body = {
      status: statusMap[status],
      rejectionReason:
        rejectionReason?.trim() || null
    };


    return this.http.put<CertificateRequest>(
      `${this.certificateUrl}/${id}/status`,
      body
    );

  }

}