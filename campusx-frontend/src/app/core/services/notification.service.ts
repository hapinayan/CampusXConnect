import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Notification
} from '../models/notification.model';


export interface CreateNotificationRequest {

  studentId: number;

  title: string;

  message: string;

  type: number;

}


export interface CreateNotificationResponse {

  message: string;

}


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly notificationUrl =
    `${environment.apiUrl}/notifications`;


  // =====================================================
  // SHARED UNREAD COUNT
  // =====================================================

  unreadCount = 0;


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // GET STUDENT NOTIFICATIONS
  //
  // GET:
  // /api/notifications/student/{studentId}
  // =====================================================

  getMyNotifications(
    studentId: number
  ): Observable<Notification[]> {

    return this.http
      .get<Notification[]>(
        `${this.notificationUrl}/student/${studentId}`
      )
      .pipe(

        tap((notifications) => {

          this.unreadCount =
            Array.isArray(notifications)
              ? notifications.filter(
                  notification =>
                    !notification.isRead
                ).length
              : 0;


          console.log(
            'Shared unread count:',
            this.unreadCount
          );

        })

      );

  }


  // =====================================================
  // MARK NOTIFICATION AS READ
  //
  // PUT:
  // /api/notifications/{id}/read
  // =====================================================

  markAsRead(
    notificationId: number
  ): Observable<any> {

    return this.http
      .put<any>(
        `${this.notificationUrl}/${notificationId}/read`,
        {}
      )
      .pipe(

        tap(() => {

          if (this.unreadCount > 0) {

            this.unreadCount--;

          }


          console.log(
            'Updated shared unread count:',
            this.unreadCount
          );

        })

      );

  }


  // =====================================================
  // CREATE NOTIFICATION
  //
  // ADMIN ONLY
  //
  // POST:
  // /api/notifications
  // =====================================================

  createNotification(
    data: CreateNotificationRequest
  ): Observable<CreateNotificationResponse> {

    return this.http
      .post<CreateNotificationResponse>(
        this.notificationUrl,
        data
      )
      .pipe(

        tap((response) => {

          console.log(
            'Notification created:',
            response
          );

        })

      );

  }

}