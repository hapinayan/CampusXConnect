import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import QRCode from 'qrcode';

import { EventService } from '../../../core/services/event.service';
import { NotificationService } from '../../../core/services/notification.service';

import {
  Event,
  EventRegistration
} from '../../../core/models/event';


@Component({
  selector: 'app-events',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events implements OnInit {

  // =====================================================
  // STUDENT PROFILE
  // =====================================================

  studentName = 'Student';


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  unreadCount = 0;


  // =====================================================
  // EVENTS
  // =====================================================

  events: Event[] = [];

  eventsLoading = true;


  // =====================================================
  // MY REGISTRATIONS
  // =====================================================

  registrations: EventRegistration[] = [];

  registrationsLoading = true;


  // =====================================================
  // UI STATES
  // =====================================================

  errorMessage = '';

  successMessage = '';

  registeringEventId: number | null = null;


  // =====================================================
  // SUCCESS POPUP + QR
  // =====================================================

  showSuccessPopup = false;

  qrCodeUrl = '';

  registeredEvent: Event | null = null;

  registeredRegistrationId: number | null = null;


  // =====================================================
  // CANCEL POPUP
  // =====================================================

  showCancelPopup = false;

  selectedRegistrationId: number | null = null;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private eventService: EventService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  ngOnInit(): void {

    console.log(
      'Events page initialized'
    );

    // Load real student name
    this.loadStudentProfile();

    // Load unread notification count
    this.loadUnreadNotificationCount();

    // Load all events
    this.loadEvents();

    // Load student's registrations
    this.loadMyRegistrations();

  }


  // =====================================================
  // LOAD STUDENT PROFILE
  // =====================================================

  loadStudentProfile(): void {

    try {

      // ===============================================
      // 1. TRY COMPLETE STUDENT OBJECT
      // ===============================================

      const storedStudent =
        localStorage.getItem('student');


      if (storedStudent) {

        const parsedStudent =
          JSON.parse(storedStudent);


        if (
          parsedStudent &&
          parsedStudent.fullName
        ) {

          this.studentName =
            parsedStudent.fullName.trim();


          console.log(
            'Student loaded from student object:',
            this.studentName
          );


          this.cdr.detectChanges();

          return;

        }

      }


      // ===============================================
      // 2. TRY FULL NAME
      // ===============================================

      const fullName =
        localStorage.getItem('fullName');


      if (
        fullName &&
        fullName.trim().length > 0
      ) {

        this.studentName =
          fullName.trim();


        console.log(
          'Student loaded from fullName:',
          this.studentName
        );


        this.cdr.detectChanges();

        return;

      }


      // ===============================================
      // 3. TRY STUDENT NAME
      // ===============================================

      const storedStudentName =
        localStorage.getItem('studentName');


      if (
        storedStudentName &&
        storedStudentName.trim().length > 0
      ) {

        this.studentName =
          storedStudentName.trim();


        console.log(
          'Student loaded from studentName:',
          this.studentName
        );


        this.cdr.detectChanges();

        return;

      }


      // ===============================================
      // 4. NO NAME FOUND
      // ===============================================

      this.studentName =
        'Student';


      console.warn(
        'Student name not found in localStorage.'
      );


      this.cdr.detectChanges();

    }

    catch (error) {

      console.error(
        'Failed to load student profile:',
        error
      );


      this.studentName =
        'Student';


      this.cdr.detectChanges();

    }

  }


  // =====================================================
  // GET STUDENT INITIAL
  // =====================================================

  getStudentInitial(): string {

    if (
      !this.studentName ||
      this.studentName.trim() === '' ||
      this.studentName === 'Student'
    ) {

      return 'S';

    }


    return this.studentName
      .trim()
      .charAt(0)
      .toUpperCase();

  }


  // =====================================================
  // LOAD UNREAD NOTIFICATION COUNT
  // =====================================================

  loadUnreadNotificationCount(): void {

    const storedStudentId =
      localStorage.getItem('studentId');


    console.log(
      'Events notification Student ID:',
      storedStudentId
    );


    if (!storedStudentId) {

      this.unreadCount = 0;

      this.cdr.detectChanges();

      return;

    }


    const studentId =
      Number(storedStudentId);


    if (!studentId) {

      this.unreadCount = 0;

      this.cdr.detectChanges();

      return;

    }


    this.notificationService
      .getMyNotifications(studentId)
      .subscribe({

        next: (notifications) => {

          if (!Array.isArray(notifications)) {

            this.unreadCount = 0;

            this.cdr.detectChanges();

            return;

          }


          this.unreadCount =
            notifications.filter(
              notification =>
                !notification.isRead
            ).length;


          console.log(
            'Events unread notifications:',
            this.unreadCount
          );


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load Events notification count:',
            error
          );


          this.unreadCount = 0;

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD EVENTS
  // =====================================================

  loadEvents(): void {

    this.eventsLoading = true;


    this.eventService
      .getEvents()
      .pipe(

        finalize(() => {

          this.eventsLoading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (data) => {

          console.log(
            'Events loaded:',
            data
          );


          this.events =
            Array.isArray(data)
              ? data
              : [];


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load events:',
            error
          );


          this.events = [];


          this.errorMessage =
            'Unable to load events.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD MY REGISTRATIONS
  // =====================================================

  loadMyRegistrations(): void {

    const storedStudentId =
      localStorage.getItem('studentId');


    console.log(
      'Stored Student ID:',
      storedStudentId
    );


    if (!storedStudentId) {

      this.registrations = [];

      this.registrationsLoading = false;

      this.cdr.detectChanges();

      return;

    }


    const studentId =
      Number(storedStudentId);


    if (!studentId) {

      this.registrations = [];

      this.registrationsLoading = false;

      this.cdr.detectChanges();

      return;

    }


    this.registrationsLoading = true;


    this.eventService
      .getMyRegistrations(studentId)
      .pipe(

        finalize(() => {

          this.registrationsLoading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (data) => {

          console.log(
            'My event registrations:',
            data
          );


          this.registrations =
            Array.isArray(data)
              ? data
              : [];


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load registrations:',
            error
          );


          this.registrations = [];


          if (
            error.status !== 404
          ) {

            this.errorMessage =
              'Unable to load your event registrations.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CHECK WHETHER STUDENT REGISTERED
  // =====================================================

  isRegistered(
    eventId: number
  ): boolean {

    return this.registrations.some(
      registration =>
        registration.eventId === eventId
    );

  }


  // =====================================================
  // GET REGISTRATION
  // =====================================================

  getRegistration(
    eventId: number
  ): EventRegistration | undefined {

    return this.registrations.find(
      registration =>
        registration.eventId === eventId
    );

  }


  // =====================================================
  // GENERATE EVENT QR CODE
  // =====================================================

  async generateEventQrCode(
    eventId: number,
    registrationId: number
  ): Promise<void> {

    try {

      const studentId =
        Number(
          localStorage.getItem('studentId')
        );


      const event =
        this.events.find(
          item =>
            item.id === eventId
        );


      const qrData =
        JSON.stringify({

          type:
            'CampusXEventRegistration',

          registrationId:
            registrationId,

          eventId:
            eventId,

          studentId:
            studentId,

          studentName:
            this.studentName,

          eventTitle:
            event?.title ||
            'CampusX Event'

        });


      this.qrCodeUrl =
        await QRCode.toDataURL(
          qrData,
          {
            width: 260,
            margin: 2
          }
        );


      console.log(
        'Event QR generated successfully'
      );


      this.cdr.detectChanges();

    }

    catch (error) {

      console.error(
        'QR generation failed:',
        error
      );


      this.qrCodeUrl = '';


      this.cdr.detectChanges();

    }

  }


  // =====================================================
  // REGISTER FOR EVENT
  // =====================================================

  registerForEvent(
    eventId: number
  ): void {

    this.errorMessage = '';

    this.successMessage = '';


    if (
      this.registeringEventId !== null
    ) {

      return;

    }


    if (
      this.isRegistered(eventId)
    ) {

      this.errorMessage =
        'You are already registered for this event.';

      return;

    }


    this.registeringEventId =
      eventId;


    this.eventService
      .registerForEvent({
        eventId: eventId
      })
      .pipe(

        finalize(() => {

          this.registeringEventId = null;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: async (response: any) => {

          console.log(
            'Event registration successful:',
            response
          );


          this.errorMessage = '';


          this.successMessage =
            'Event registration successful!';


          // ===========================================
          // STORE REGISTERED EVENT
          // ===========================================

          this.registeredEvent =
            this.events.find(
              event =>
                event.id === eventId
            ) || null;


          // ===========================================
          // GET REGISTRATION ID FROM BACKEND RESPONSE
          // ===========================================

          const registrationId =
            Number(
              response?.id ??
              response?.registrationId ??
              response?.eventRegistrationId ??
              0
            );


          this.registeredRegistrationId =
            registrationId > 0
              ? registrationId
              : null;


          // ===========================================
          // GENERATE QR
          // ===========================================

          if (
            registrationId > 0
          ) {

            await this.generateEventQrCode(
              eventId,
              registrationId
            );

          }

          else {

            console.warn(
              'Registration ID was not returned by backend.'
            );


            this.qrCodeUrl = '';

          }


          // ===========================================
          // SHOW SUCCESS POPUP
          // ===========================================

          this.showSuccessPopup = true;


          // Reload registrations

          this.loadMyRegistrations();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Event registration failed:',
            error
          );


          this.successMessage = '';


          if (
            error.status === 400
          ) {

            this.errorMessage =
              error.error?.message ||
              error.error?.title ||
              'Invalid event registration.';

          }


          else if (
            error.status === 401
          ) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }


          else if (
            error.status === 409
          ) {

            this.errorMessage =
              error.error?.message ||
              'You are already registered or the event is full.';


            this.loadMyRegistrations();

          }


          else {

            this.errorMessage =
              'Unable to register for this event.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CLOSE SUCCESS POPUP
  // =====================================================

  closeSuccessPopup(): void {

    this.showSuccessPopup = false;

    this.registeredEvent = null;

    this.registeredRegistrationId = null;

    this.qrCodeUrl = '';

    this.successMessage = '';


    this.cdr.detectChanges();

  }


  // =====================================================
  // OPEN CANCEL POPUP
  // =====================================================

  cancelRegistration(
    registrationId: number
  ): void {

    this.errorMessage = '';

    this.successMessage = '';


    this.selectedRegistrationId =
      registrationId;


    this.showCancelPopup = true;


    this.cdr.detectChanges();

  }


  // =====================================================
  // CLOSE CANCEL POPUP
  // =====================================================

  closeCancelPopup(): void {

    this.showCancelPopup = false;

    this.selectedRegistrationId = null;


    this.cdr.detectChanges();

  }


  // =====================================================
  // CONFIRM CANCEL REGISTRATION
  // =====================================================

  confirmCancelRegistration(): void {

    if (
      this.selectedRegistrationId === null
    ) {

      return;

    }


    const registrationId =
      this.selectedRegistrationId;


    this.showCancelPopup = false;

    this.selectedRegistrationId = null;


    this.errorMessage = '';

    this.successMessage = '';


    this.eventService
      .cancelRegistration(
        registrationId
      )
      .pipe(

        finalize(() => {

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: () => {

          console.log(
            'Event registration cancelled:',
            registrationId
          );


          this.successMessage =
            'Event registration cancelled successfully.';


          this.registrations =
            this.registrations.filter(
              registration =>
                registration.id !== registrationId
            );


          this.cdr.detectChanges();


          setTimeout(() => {

            this.successMessage = '';

            this.cdr.detectChanges();

          }, 5000);

        },


        error: (error) => {

          console.error(
            'Cancel registration failed:',
            error
          );


          if (
            error.status === 401
          ) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }


          else if (
            error.status === 403
          ) {

            this.errorMessage =
              'You cannot cancel another student\'s registration.';

          }


          else if (
            error.status === 404
          ) {

            this.errorMessage =
              'Registration not found.';

          }


          else {

            this.errorMessage =
              'Unable to cancel event registration.';

          }


          this.cdr.detectChanges();

        }

      });

  }

}