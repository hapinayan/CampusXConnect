import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Notification
} from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly notificationUrl =
    `${environment.apiUrl}/notifications`;

  constructor(
    private http: HttpClient
  ) {}

  // =====================================================
  // GET STUDENT NOTIFICATIONS
  // GET: api/notifications/student/{studentId}
  // =====================================================

  getMyNotifications(
    studentId: number
  ): Observable<Notification[]> {

    return this.http.get<Notification[]>(
      `${this.notificationUrl}/student/${studentId}`
    );
  }


  // =====================================================
  // MARK NOTIFICATION AS READ
  // PUT: api/notifications/{id}/read
  // =====================================================

  markAsRead(
    notificationId: number
  ): Observable<any> {

    return this.http.put<any>(
      `${this.notificationUrl}/${notificationId}/read`,
      {}
    );
  }

}