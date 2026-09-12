import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Observable,
  shareReplay
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

import {
  Lab,
  LabBooking,
  CreateLabBooking,
  AvailableSlot
} from '../models/lab';


@Injectable({
  providedIn: 'root'
})
export class LabService {

  // =====================================================
  // API URLS
  // =====================================================

  private readonly labUrl =
    `${environment.apiUrl}/Labs`;

  private readonly bookingUrl =
    `${environment.apiUrl}/lab-bookings`;


  // =====================================================
  // LAB CACHE
  // =====================================================

  private labsCache$?: Observable<Lab[]>;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // GET ALL LABORATORIES
  // =====================================================

  getLabs(): Observable<Lab[]> {

    if (!this.labsCache$) {

      this.labsCache$ =
        this.http
          .get<Lab[]>(
            this.labUrl
          )
          .pipe(
            shareReplay(1)
          );

    }

    return this.labsCache$;

  }


  // =====================================================
  // CLEAR LAB CACHE
  // =====================================================

  clearLabsCache(): void {

    this.labsCache$ = undefined;

  }


  // =====================================================
  // GET LAB BY ID
  // =====================================================

  getLabById(
    id: number
  ): Observable<Lab> {

    return this.http.get<Lab>(
      `${this.labUrl}/${id}`
    );

  }


  // =====================================================
  // GET AVAILABLE TIME SLOTS
  // =====================================================

  getAvailableSlots(
    labId: number,
    date: string
  ): Observable<AvailableSlot[]> {

    const params =
      new HttpParams()
        .set(
          'date',
          date
        );


    return this.http.get<AvailableSlot[]>(
      `${this.labUrl}/${labId}/slots`,
      {
        params
      }
    );

  }


  // =====================================================
  // DEFAULT TIME SLOTS
  // =====================================================

  getDefaultTimeSlots():
    AvailableSlot[] {

    return [

      {
        startTime: '09:00:00',
        endTime: '10:00:00',
        isAvailable: true
      },

      {
        startTime: '10:00:00',
        endTime: '11:00:00',
        isAvailable: true
      },

      {
        startTime: '11:00:00',
        endTime: '12:00:00',
        isAvailable: true
      },

      {
        startTime: '12:00:00',
        endTime: '13:00:00',
        isAvailable: true
      },

      {
        startTime: '13:00:00',
        endTime: '14:00:00',
        isAvailable: true
      },

      {
        startTime: '14:00:00',
        endTime: '15:00:00',
        isAvailable: true
      }

    ];

  }


  // =====================================================
  // STUDENT - BOOK LABORATORY
  // =====================================================

  bookLab(
    booking: CreateLabBooking
  ): Observable<LabBooking> {

    console.log(
      'Sending lab booking:',
      booking
    );


    return this.http.post<LabBooking>(
      this.bookingUrl,
      booking
    );

  }


  // =====================================================
  // STUDENT - GET MY LAB BOOKINGS
  // =====================================================

  getMyBookings(
    studentId: number
  ): Observable<LabBooking[]> {

    return this.http.get<LabBooking[]>(
      `${this.bookingUrl}/student/${studentId}`
    );

  }


  // =====================================================
  // STUDENT - CANCEL LAB BOOKING
  // =====================================================

  cancelBooking(
    bookingId: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.bookingUrl}/${bookingId}`
    );

  }


  // =====================================================
  // ADMIN - CREATE LAB
  // POST: api/Labs
  // =====================================================

  createLab(
    name: string,
    location: string,
    capacity: number
  ): Observable<Lab> {

    const body = {
      name,
      location,
      capacity
    };


    return this.http.post<Lab>(
      this.labUrl,
      body
    );

  }


  // =====================================================
  // ADMIN - UPDATE LAB
  // PUT: api/Labs/{id}
  // =====================================================

  updateLab(
    id: number,
    name: string,
    location: string,
    capacity: number,
    isActive: boolean
  ): Observable<any> {

    const body = {
      name,
      location,
      capacity,
      isActive
    };


    return this.http.put<any>(
      `${this.labUrl}/${id}`,
      body
    );

  }


  // =====================================================
  // ADMIN - CHANGE LAB STATUS
  // =====================================================

  updateLabStatus(
    lab: Lab,
    isActive: boolean
  ): Observable<any> {

    const body = {
      name: lab.name,
      location: lab.location,
      capacity: lab.capacity,
      isActive
    };


    return this.http.put<any>(
      `${this.labUrl}/${lab.id}`,
      body
    );

  }

}