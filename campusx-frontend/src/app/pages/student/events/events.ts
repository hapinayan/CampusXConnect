import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { EventService } from '../../../core/services/event.service';

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
  // CANCEL POPUP
  // =====================================================

  showCancelPopup = false;

  selectedRegistrationId: number | null = null;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private eventService: EventService,
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


    // Load all events
    this.loadEvents();


    // Load student's registrations
    this.loadMyRegistrations();

  }


  // =====================================================
  // LOAD STUDENT PROFILE
  // =====================================================

  loadStudentProfile(): void {

    const storedStudentName =
      localStorage.getItem('studentName');


    if (
      storedStudentName &&
      storedStudentName.trim()
    ) {

      this.studentName =
        storedStudentName.trim();

    }

    else {

      this.studentName =
        'Student';

    }


    console.log(
      'Logged-in student:',
      this.studentName
    );


    this.cdr.detectChanges();

  }


  // =====================================================
  // GET STUDENT INITIAL
  // =====================================================

  getStudentInitial(): string {

    if (
      !this.studentName ||
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
      localStorage.getItem(
        'studentId'
      );


    console.log(
      'Stored Student ID:',
      storedStudentId
    );


    // ===================================================
    // NO STUDENT ID
    // ===================================================

    if (!storedStudentId) {

      this.registrations = [];

      this.registrationsLoading = false;

      this.cdr.detectChanges();

      return;

    }


    const studentId =
      Number(storedStudentId);


    // ===================================================
    // INVALID STUDENT ID
    // ===================================================

    if (!studentId) {

      this.registrations = [];

      this.registrationsLoading = false;

      this.cdr.detectChanges();

      return;

    }


    // ===================================================
    // LOAD REGISTRATIONS
    // ===================================================

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
            'My registrations:',
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


          // 404 means no registrations

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
  // REGISTER FOR EVENT
  // =====================================================

  registerForEvent(
    eventId: number
  ): void {

    this.errorMessage = '';

    this.successMessage = '';


    // ===================================================
    // PREVENT DOUBLE CLICK
    // ===================================================

    if (
      this.registeringEventId !== null
    ) {

      return;

    }


    // ===================================================
    // ALREADY REGISTERED
    // ===================================================

    if (
      this.isRegistered(eventId)
    ) {

      this.errorMessage =
        'You are already registered for this event.';

      return;

    }


    // ===================================================
    // START REGISTERING
    // ===================================================

    this.registeringEventId =
      eventId;


    // ===================================================
    // API REQUEST
    // ===================================================

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

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (response) => {

          console.log(
            'Event registration successful:',
            response
          );


          this.errorMessage = '';


          this.successMessage =
            'Event registration successful!';


          // Refresh registrations

          this.loadMyRegistrations();


          this.cdr.detectChanges();


          // Hide success message

          setTimeout(() => {

            this.successMessage = '';

            this.cdr.detectChanges();

          }, 5000);

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error) => {

          console.error(
            'Event registration failed:',
            error
          );


          this.successMessage = '';


          // 400

          if (
            error.status === 400
          ) {

            this.errorMessage =
              error.error?.message ||
              error.error?.title ||
              'Invalid event registration.';

          }


          // 401

          else if (
            error.status === 401
          ) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }


          // 409

          else if (
            error.status === 409
          ) {

            this.errorMessage =
              error.error?.message ||
              'You are already registered or the event is full.';


            // Refresh registrations

            this.loadMyRegistrations();

          }


          // Other errors

          else {

            this.errorMessage =
              'Unable to register for this event.';

          }


          this.cdr.detectChanges();

        }

      });

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

    // ===================================================
    // CHECK REGISTRATION
    // ===================================================

    if (
      this.selectedRegistrationId === null
    ) {

      return;

    }


    const registrationId =
      this.selectedRegistrationId;


    // ===================================================
    // CLOSE POPUP
    // ===================================================

    this.showCancelPopup = false;

    this.selectedRegistrationId = null;


    this.errorMessage = '';

    this.successMessage = '';


    // ===================================================
    // API REQUEST
    // ===================================================

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

        // ===============================================
        // SUCCESS
        // ===============================================

        next: () => {

          console.log(
            'Event registration cancelled.'
          );


          this.successMessage =
            'Event registration cancelled successfully.';


          // Remove immediately from UI

          this.registrations =
            this.registrations.filter(
              registration =>
                registration.id !== registrationId
            );


          this.cdr.detectChanges();


          // Hide success message

          setTimeout(() => {

            this.successMessage = '';

            this.cdr.detectChanges();

          }, 5000);

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error) => {

          console.error(
            'Cancel registration failed:',
            error
          );


          // 401

          if (
            error.status === 401
          ) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }


          // 403

          else if (
            error.status === 403
          ) {

            this.errorMessage =
              'You cannot cancel another student\'s registration.';

          }


          // 404

          else if (
            error.status === 404
          ) {

            this.errorMessage =
              'Registration not found.';

          }


          // Other

          else {

            this.errorMessage =
              'Unable to cancel event registration.';

          }


          this.cdr.detectChanges();

        }

      });

  }

}