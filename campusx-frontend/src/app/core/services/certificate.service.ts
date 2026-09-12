import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  CertificateRequest,
  CreateCertificateRequest,
  UpdateCertificateStatus
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
  // POST /api/certificate-requests
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
  // GET /api/certificate-requests/my
  // =====================================================

  getMyRequests():
    Observable<CertificateRequest[]> {

    return this.http.get<CertificateRequest[]>(
      `${this.certificateUrl}/my`
    );

  }


  // =====================================================
  // ADMIN - GET ALL CERTIFICATE REQUESTS
  // GET /api/certificate-requests/admin
  // =====================================================

  getAdminRequests():
    Observable<CertificateRequest[]> {

    return this.http.get<CertificateRequest[]>(
      `${this.certificateUrl}/admin`
    );

  }


  // =====================================================
  // ADMIN - UPDATE CERTIFICATE STATUS
  // PUT /api/certificate-requests/{id}/status
  // =====================================================

  updateRequestStatus(
    id: number,
    data: UpdateCertificateStatus
  ): Observable<CertificateRequest> {

    return this.http.put<CertificateRequest>(
      `${this.certificateUrl}/${id}/status`,
      data
    );

  }


  // =====================================================
  // GET REQUEST BY ID
  // EXISTING FRONTEND COMPATIBILITY
  // =====================================================

  getRequestById(
    id: number
  ): Observable<CertificateRequest> {

    return this.http.get<CertificateRequest>(
      `${this.certificateUrl}/${id}`
    );

  }


  // =====================================================
  // CANCEL REQUEST
  // EXISTING FRONTEND COMPATIBILITY
  // =====================================================

  cancelRequest(
    id: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.certificateUrl}/${id}`
    );

  }

}