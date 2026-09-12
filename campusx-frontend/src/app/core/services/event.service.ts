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
  // STUDENT - REGISTER FOR EVENT
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
  // STUDENT - GET MY EVENT REGISTRATIONS
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
  // STUDENT - CANCEL EVENT REGISTRATION
  // DELETE: api/event-registrations/{id}
  // =====================================================

  cancelRegistration(
    registrationId: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.registrationUrl}/${registrationId}`
    );

  }


  // =====================================================
  // ADMIN - CREATE EVENT
  // POST: api/events
  // =====================================================

  createEvent(
    title: string,
    description: string,
    eventDate: string,
    venue: string,
    capacity: number
  ): Observable<Event> {

    const body = {
      title,
      description,
      eventDate,
      venue,
      capacity
    };

    return this.http.post<Event>(
      this.eventUrl,
      body
    );

  }


  // =====================================================
  // ADMIN - UPDATE EVENT
  // PUT: api/events/{id}
  // =====================================================

  updateEvent(
    id: number,
    title: string,
    description: string,
    eventDate: string,
    venue: string,
    capacity: number,
    isActive: boolean
  ): Observable<any> {

    const body = {
      title,
      description,
      eventDate,
      venue,
      capacity,
      isActive
    };

    return this.http.put<any>(
      `${this.eventUrl}/${id}`,
      body
    );

  }


  // =====================================================
  // ADMIN - ACTIVATE / DEACTIVATE EVENT
  // =====================================================

  updateEventStatus(
    event: Event,
    isActive: boolean
  ): Observable<any> {

    const body = {
      title: event.title,
      description: event.description,
      eventDate: event.eventDate,
      venue: event.venue,
      capacity: event.capacity,
      isActive
    };

    return this.http.put<any>(
      `${this.eventUrl}/${event.id}`,
      body
    );

  }

}