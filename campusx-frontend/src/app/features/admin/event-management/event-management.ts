import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { finalize } from 'rxjs';


import {
  Event as CampusEvent,
  CreateEvent,
  UpdateEvent
} from '../../../core/models/event';


import {
  EventService
} from '../../../core/services/event.service';


import {
  AdminSidebar
} from '../shared/admin-sidebar/admin-sidebar';


@Component({
  selector: 'app-event-management',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar
  ],

  templateUrl: './event-management.html',

  styleUrl: './event-management.css'
})
export class EventManagement implements OnInit {


  // =====================================================
  // EVENTS LIST
  // =====================================================

  events: CampusEvent[] = [];


  // =====================================================
  // STATES
  // =====================================================

  loading = false;

  saving = false;

  errorMessage = '';

  successMessage = '';


  // =====================================================
  // CREATE EVENT FORM
  // =====================================================

  newEvent: CreateEvent = {

    title: '',

    description: '',

    eventDate: '',

    venue: '',

    capacity: 1

  };


  // =====================================================
  // EDIT EVENT
  // =====================================================

  selectedEvent: CampusEvent | null = null;


  editEventData: UpdateEvent = {

    title: '',

    description: '',

    eventDate: '',

    venue: '',

    capacity: 1,

    isActive: true

  };


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadEvents();

  }


  // =====================================================
  // LOAD ALL EVENTS
  // =====================================================

  loadEvents(): void {

    this.loading = true;

    this.errorMessage = '';


    this.eventService
      .getEvents()
      .pipe(

        finalize(() => {

          this.loading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (events) => {

          this.events =
            Array.isArray(events)
              ? events
              : [];


          console.log(
            'Events loaded:',
            events
          );


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load events:',
            error
          );


          this.events = [];


          if (error.status === 401) {

            this.errorMessage =
              'Unauthorized. Please login again as admin.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to access events.';

          }

          else {

            this.errorMessage =
              error?.error?.message ||
              'Failed to load events.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CREATE EVENT
  // =====================================================

  createEvent(): void {

    this.errorMessage = '';

    this.successMessage = '';


    // ===================================================
    // VALIDATION
    // ===================================================

    if (
      !this.newEvent.title.trim() ||
      !this.newEvent.description.trim() ||
      !this.newEvent.eventDate ||
      !this.newEvent.venue.trim()
    ) {

      this.errorMessage =
        'Please fill all event fields.';

      return;

    }


    if (
      this.newEvent.capacity <= 0
    ) {

      this.errorMessage =
        'Capacity must be greater than 0.';

      return;

    }


    // ===================================================
    // PREVENT DOUBLE SUBMIT
    // ===================================================

    if (this.saving) {

      return;

    }


    this.saving = true;


    // ===================================================
    // PREPARE CREATE DATA
    // ===================================================

    const createData: CreateEvent = {

      title:
        this.newEvent.title.trim(),

      description:
        this.newEvent.description.trim(),

      eventDate:
        this.newEvent.eventDate,

      venue:
        this.newEvent.venue.trim(),

      capacity:
        this.newEvent.capacity

    };


    // ===================================================
    // CREATE EVENT API
    // ===================================================

    this.eventService
      .createEvent(
        createData
      )
      .pipe(

        finalize(() => {

          this.saving = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (event) => {

          console.log(
            'Event created:',
            event
          );


          this.successMessage =
            'Event created successfully!';


          // =================================================
          // CLEAR CREATE FORM
          // =================================================

          this.resetCreateForm();


          // =================================================
          // RELOAD EVENT TABLE
          // =================================================

          this.loadEvents();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to create event:',
            error
          );


          if (error.status === 401) {

            this.errorMessage =
              'Unauthorized. Please login again as admin.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'Only administrators can create events.';

          }

          else if (error.status === 400) {

            this.errorMessage =
              error?.error?.message ||
              error?.error?.title ||
              'Invalid event data.';

          }

          else {

            this.errorMessage =
              error?.error?.message ||
              'Failed to create event.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // OPEN EDIT
  // =====================================================

  openEdit(
    event: CampusEvent
  ): void {

    this.errorMessage = '';

    this.successMessage = '';


    this.selectedEvent =
      event;


    this.editEventData = {

      title:
        event.title,

      description:
        event.description,

      eventDate:
        this.formatDateForInput(
          event.eventDate
        ),

      venue:
        event.venue,

      capacity:
        event.capacity,

      isActive:
        event.isActive

    };


    this.cdr.detectChanges();

  }


  // =====================================================
  // UPDATE EVENT
  // =====================================================

  updateEvent(): void {

    if (!this.selectedEvent) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';


    // ===================================================
    // VALIDATION
    // ===================================================

    if (
      !this.editEventData.title.trim() ||
      !this.editEventData.description.trim() ||
      !this.editEventData.eventDate ||
      !this.editEventData.venue.trim()
    ) {

      this.errorMessage =
        'Please fill all event fields.';

      return;

    }


    if (
      this.editEventData.capacity <= 0
    ) {

      this.errorMessage =
        'Capacity must be greater than 0.';

      return;

    }


    // ===================================================
    // PREVENT DOUBLE SUBMIT
    // ===================================================

    if (this.saving) {

      return;

    }


    this.saving = true;


    const eventId =
      this.selectedEvent.id;


    // ===================================================
    // PREPARE UPDATE DATA
    // ===================================================

    const updateData: UpdateEvent = {

      title:
        this.editEventData.title.trim(),

      description:
        this.editEventData.description.trim(),

      eventDate:
        this.editEventData.eventDate,

      venue:
        this.editEventData.venue.trim(),

      capacity:
        this.editEventData.capacity,

      isActive:
        this.editEventData.isActive

    };


    // ===================================================
    // UPDATE EVENT API
    // ===================================================

    this.eventService
      .updateEvent(
        eventId,
        updateData
      )
      .pipe(

        finalize(() => {

          this.saving = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (event) => {

          console.log(
            'Event updated:',
            event
          );


          this.successMessage =
            'Event updated successfully!';


          this.closeEdit();


          this.loadEvents();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to update event:',
            error
          );


          if (error.status === 401) {

            this.errorMessage =
              'Unauthorized. Please login again as admin.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to update events.';

          }

          else if (error.status === 400) {

            this.errorMessage =
              error?.error?.message ||
              error?.error?.title ||
              'Invalid event data.';

          }

          else {

            this.errorMessage =
              error?.error?.message ||
              'Failed to update event.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // DEACTIVATE EVENT
  // =====================================================

  deactivateEvent(
    event: CampusEvent
  ): void {

    const confirmed =
      window.confirm(
        `Deactivate "${event.title}"?`
      );


    if (!confirmed) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';


    this.eventService
      .deactivateEvent(
        event
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Event deactivated successfully!';


          this.loadEvents();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Deactivate failed:',
            error
          );


          if (error.status === 401) {

            this.errorMessage =
              'Unauthorized. Please login again as admin.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to deactivate events.';

          }

          else {

            this.errorMessage =
              error?.error?.message ||
              'Failed to deactivate event.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // ACTIVATE EVENT
  // =====================================================

  activateEvent(
    event: CampusEvent
  ): void {

    this.errorMessage = '';

    this.successMessage = '';


    this.eventService
      .activateEvent(
        event
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Event activated successfully!';


          this.loadEvents();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Activate failed:',
            error
          );


          if (error.status === 401) {

            this.errorMessage =
              'Unauthorized. Please login again as admin.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to activate events.';

          }

          else {

            this.errorMessage =
              error?.error?.message ||
              'Failed to activate event.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  closeEdit(): void {

    this.selectedEvent = null;


    this.editEventData = {

      title: '',

      description: '',

      eventDate: '',

      venue: '',

      capacity: 1,

      isActive: true

    };


    this.cdr.detectChanges();

  }


  // =====================================================
  // RESET CREATE FORM
  // =====================================================

  resetCreateForm(): void {

    this.newEvent = {

      title: '',

      description: '',

      eventDate: '',

      venue: '',

      capacity: 1

    };


    this.cdr.detectChanges();

  }


  // =====================================================
  // FORMAT DATE FOR DATETIME-LOCAL INPUT
  // =====================================================

  private formatDateForInput(
    date: string
  ): string {

    if (!date) {

      return '';

    }


    return date.substring(
      0,
      16
    );

  }


  // =====================================================
  // TOTAL EVENTS
  // =====================================================

  get totalEvents(): number {

    return this.events.length;

  }


  // =====================================================
  // ACTIVE EVENTS
  // =====================================================

  get activeEvents(): number {

    return this.events.filter(

      event =>
        event.isActive

    ).length;

  }


  // =====================================================
  // INACTIVE EVENTS
  // =====================================================

  get inactiveEvents(): number {

    return this.events.filter(

      event =>
        !event.isActive

    ).length;

  }

}