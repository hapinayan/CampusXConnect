import {
  Component,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  NotificationService
} from '../../../../core/services/notification.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './admin-notifications.html',
  styleUrl: './admin-notifications.css'
})
export class AdminNotifications implements OnInit {

  notifications = signal<any[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');


  // =========================
  // COUNTS
  // =========================

  totalNotifications = computed(() =>
    this.notifications().length
  );


  unreadNotifications = computed(() =>
    this.notifications().filter(
      notification =>
        notification.isRead === false
    ).length
  );


  readNotifications = computed(() =>
    this.notifications().filter(
      notification =>
        notification.isRead === true
    ).length
  );


  constructor(
    private notificationService:
      NotificationService
  ) {}


  ngOnInit(): void {

    this.loadNotifications();

  }


  // =========================
  // LOAD ALL NOTIFICATIONS
  // =========================

  loadNotifications(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');


    this.notificationService
      .getAllNotifications()
      .subscribe({

        next: (notifications) => {

          this.notifications.set(
            notifications
          );

          this.isLoading.set(false);

          console.log(
            'Admin notifications loaded:',
            notifications
          );

        },


        error: (error) => {

          console.error(
            'Error loading admin notifications:',
            error
          );

          this.errorMessage.set(
            'Unable to load notifications.'
          );

          this.isLoading.set(false);

        }

      });

  }

}