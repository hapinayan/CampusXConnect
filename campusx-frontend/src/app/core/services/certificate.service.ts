import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  CertificateRequest,
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
  // CREATE CERTIFICATE REQUEST
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
  // GET MY CERTIFICATE REQUESTS
  // GET: api/certificate-requests/student/{studentId}
  // =====================================================

  getMyRequests(): Observable<CertificateRequest[]> {

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

}