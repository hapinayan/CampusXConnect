import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Hostel,
  HostelApplication
} from '../models/hostel';

@Injectable({
  providedIn: 'root'
})
export class HostelService {

  private readonly hostelUrl =
    `${environment.apiUrl}/Hostel`;

  constructor(private http: HttpClient) {}

  // =========================
  // GET AVAILABLE HOSTELS
  // =========================

  getHostels(): Observable<Hostel[]> {
    return this.http.get<Hostel[]>(
      this.hostelUrl
    );
  }


  // =========================
  // APPLY FOR HOSTEL
  // =========================

  applyForHostel(
    hostelId: number,
    preferences: string
  ): Observable<any> {

    const params = new HttpParams()
      .set('hostelId', hostelId.toString())
      .set('preferences', preferences);

    return this.http.post<any>(
      `${this.hostelUrl}/apply`,
      null,
      { params }
    );
  }


  // =========================
  // GET MY APPLICATION
  // =========================

  getMyApplication(): Observable<HostelApplication> {

    return this.http.get<HostelApplication>(
      `${this.hostelUrl}/my-application`
    );
  }
}