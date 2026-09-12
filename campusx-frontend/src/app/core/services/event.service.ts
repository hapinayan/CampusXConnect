import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Event,
  EventRegistration,
  CreateEventRegistration
} from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly eventUrl =
    `${environment.apiUrl}/events`;

  private readonly registrationUrl =
    `${environment.apiUrl}/event-registrations`;


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // GET ALL EVENTS
  // GET: api/events
  // =====================================================

  getEvents(): Observable<Event[]> {

    return this.http.get<Event[]>(
      this.eventUrl
    );

  }


  // =====================================================
  // GET EVENT BY ID
  // GET: api/events/{id}
  // =====================================================

  getEventById(
    id: number
  ): Observable<Event> {

    return this.http.get<Event>(
      `${this.eventUrl}/${id}`
    );

  }


  // =====================================================
  // REGISTER FOR EVENT
  // POST: api/event-registrations
  // =====================================================

  registerForEvent(
    data: CreateEventRegistration
  ): Observable<EventRegistration> {

    return this.http.post<EventRegistration>(
      this.registrationUrl,
      data
    );

  }


  // =====================================================
  // GET MY EVENT REGISTRATIONS
  // GET: api/event-registrations/student/{studentId}
  // =====================================================

  getMyRegistrations(
    studentId: number
  ): Observable<EventRegistration[]> {

    return this.http.get<EventRegistration[]>(
      `${this.registrationUrl}/student/${studentId}`
    );

  }


  // =====================================================
  // CANCEL EVENT REGISTRATION
  // DELETE: api/event-registrations/{id}
  // =====================================================

  cancelRegistration(
    registrationId: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.registrationUrl}/${registrationId}`
    );

  }

}