import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Event,
  CreateEvent,
  UpdateEvent,
  EventRegistration,
  CreateEventRegistration
} from '../models/event';

import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  // =====================================================
  // API URLS
  // =====================================================

  private readonly eventUrl =
    `${environment.apiUrl}/Events`;

  private readonly registrationUrl =
    `${environment.apiUrl}/event-registrations`;


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // GET ALL EVENTS
  // GET /api/Events
  // =====================================================

  getEvents(): Observable<Event[]> {

    return this.http.get<Event[]>(
      this.eventUrl
    );

  }


  // =====================================================
  // GET EVENT BY ID
  // GET /api/Events/{id}
  // =====================================================

  getEventById(
    id: number
  ): Observable<Event> {

    return this.http.get<Event>(
      `${this.eventUrl}/${id}`
    );

  }


  // =====================================================
  // CREATE EVENT
  // POST /api/Events
  // ADMIN ONLY
  // =====================================================

  createEvent(
    event: CreateEvent
  ): Observable<Event> {

    return this.http.post<Event>(
      this.eventUrl,
      event
    );

  }


  // =====================================================
  // UPDATE EVENT
  // PUT /api/Events/{id}
  // ADMIN ONLY
  // =====================================================

  updateEvent(
    id: number,
    event: UpdateEvent
  ): Observable<Event> {

    return this.http.put<Event>(
      `${this.eventUrl}/${id}`,
      event
    );

  }


  // =====================================================
  // ACTIVATE EVENT
  // =====================================================

  activateEvent(
    event: Event
  ): Observable<Event> {

    const updatedEvent: UpdateEvent = {

      title: event.title,
      description: event.description,
      eventDate: event.eventDate,
      venue: event.venue,
      capacity: event.capacity,
      isActive: true

    };


    return this.updateEvent(
      event.id,
      updatedEvent
    );

  }


  // =====================================================
  // DEACTIVATE EVENT
  // =====================================================

  deactivateEvent(
    event: Event
  ): Observable<Event> {

    const updatedEvent: UpdateEvent = {

      title: event.title,
      description: event.description,
      eventDate: event.eventDate,
      venue: event.venue,
      capacity: event.capacity,
      isActive: false

    };


    return this.updateEvent(
      event.id,
      updatedEvent
    );

  }


  // =====================================================
  // GET MY EVENT REGISTRATIONS
  // GET /api/event-registrations/student/{studentId}
  // =====================================================

  getMyRegistrations(
    studentId: number
  ): Observable<EventRegistration[]> {

    return this.http.get<EventRegistration[]>(
      `${this.registrationUrl}/student/${studentId}`
    );

  }


  // =====================================================
  // REGISTER FOR EVENT
  // POST /api/event-registrations
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
  // CANCEL EVENT REGISTRATION
  // DELETE /api/event-registrations/{id}
  // =====================================================

  cancelRegistration(
    registrationId: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.registrationUrl}/${registrationId}`
    );

  }

}