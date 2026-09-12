import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  environment
} from '../../../environments/environment';

import {
  Hostel,
  HostelApplication,
  Room
} from '../models/hostel';


@Injectable({
  providedIn: 'root'
})
export class HostelService {

  private readonly hostelUrl =
    `${environment.apiUrl}/Hostel`;

  private readonly adminUrl =
    `${environment.apiUrl}/Admin`;


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // STUDENT - GET AVAILABLE HOSTELS
  // GET: api/Hostel
  // =====================================================

  getHostels(): Observable<Hostel[]> {

    return this.http.get<Hostel[]>(
      this.hostelUrl
    );

  }


  // =====================================================
  // STUDENT - APPLY FOR HOSTEL
  // POST: api/Hostel/apply
  // =====================================================

  applyForHostel(
    hostelId: number,
    preferences: string
  ): Observable<any> {

    const params =
      new HttpParams()
        .set(
          'hostelId',
          hostelId.toString()
        )
        .set(
          'preferences',
          preferences
        );


    return this.http.post<any>(
      `${this.hostelUrl}/apply`,
      null,
      {
        params
      }
    );

  }


  // =====================================================
  // STUDENT - GET MY APPLICATION
  // GET: api/Hostel/my-application
  // =====================================================

  getMyApplication():
    Observable<HostelApplication> {

    return this.http.get<HostelApplication>(
      `${this.hostelUrl}/my-application`
    );

  }


  // =====================================================
  // ADMIN - GET HOSTEL APPLICATIONS
  // GET: api/Admin/hostel-applications
  // =====================================================

  getAdminHostelApplications():
    Observable<any[]> {

    return this.http.get<any[]>(
      `${this.adminUrl}/hostel-applications`
    );

  }


  // =====================================================
  // ADMIN - GET ACTIVE ROOMS
  // GET: api/Admin/rooms
  // =====================================================

  getAdminRooms():
    Observable<Room[]> {

    return this.http.get<Room[]>(
      `${this.adminUrl}/rooms`
    );

  }


  // =====================================================
  // ADMIN - UPDATE APPLICATION STATUS
  // PUT:
  // api/Admin/hostel-applications/{id}/status
  // =====================================================

  updateHostelApplicationStatus(
    applicationId: number,
    status: number
  ): Observable<any> {

    const params =
      new HttpParams()
        .set(
          'status',
          status.toString()
        );


    return this.http.put<any>(
      `${this.adminUrl}/hostel-applications/${applicationId}/status`,
      null,
      {
        params
      }
    );

  }


  // =====================================================
  // ADMIN - ASSIGN ROOM
  // PUT:
  // api/Admin/hostel-applications/{id}/assign-room/{roomId}
  // =====================================================

  assignRoom(
    applicationId: number,
    roomId: number
  ): Observable<any> {

    return this.http.put<any>(
      `${this.adminUrl}/hostel-applications/${applicationId}/assign-room/${roomId}`,
      {}
    );

  }

}