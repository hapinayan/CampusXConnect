import {
  Component,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EventService } from '../../../../core/services/event.service';

@Component({
  selector: 'app-admin-events',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './admin-events.html',
  styleUrl: './admin-events.css'
})
export class AdminEvents implements OnInit {

  // =====================================================
  // EVENT LIST
  // =====================================================

  events = signal<any[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');

  successMessage = signal('');


  // =====================================================
  // ADD EVENT FORM
  // =====================================================

  eventTitle = '';

  eventDescription = '';

  eventDate = '';

  eventVenue = '';

  eventCapacity: number | null = null;


  // =====================================================
  // EDIT EVENT
  // =====================================================

  editingEventId = signal<number | null>(null);

  editTitle = '';

  editDescription = '';

  editDate = '';

  editVenue = '';

  editCapacity: number | null = null;

  editIsActive = true;


  // =====================================================
  // ACTION STATES
  // =====================================================

  isSaving = signal(false);

  updatingEventId = signal<number | null>(null);


  // =====================================================
  // COUNTS
  // =====================================================

  totalEvents = computed(() =>
    this.events().length
  );


  activeEvents = computed(() =>
    this.events().filter(
      event => event.isActive === true
    ).length
  );


  inactiveEvents = computed(() =>
    this.events().filter(
      event => event.isActive === false
    ).length
  );


  constructor(
    private eventService: EventService
  ) {}


  ngOnInit(): void {

    this.loadEvents();

  }


  // =====================================================
  // LOAD EVENTS
  // =====================================================

  loadEvents(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.eventService
      .getEvents()
      .subscribe({

        next: (events: any[]) => {

          this.events.set(events);

          this.isLoading.set(false);

          console.log(
            'Events loaded:',
            events
          );

        },

        error: (error: any) => {

          console.error(
            'Error loading events:',
            error
          );

          this.errorMessage.set(
            'Unable to load events.'
          );

          this.isLoading.set(false);

        }

      });

  }


  // =====================================================
  // ADD EVENT
  // =====================================================

  addEvent(): void {

    this.clearMessages();


    if (
      !this.eventTitle.trim() ||
      !this.eventDescription.trim() ||
      !this.eventDate ||
      !this.eventVenue.trim() ||
      !this.eventCapacity ||
      this.eventCapacity <= 0
    ) {

      this.errorMessage.set(
        'Please fill all event details correctly.'
      );

      return;

    }


    this.isSaving.set(true);


    this.eventService
      .createEvent(
        this.eventTitle.trim(),
        this.eventDescription.trim(),
        this.eventDate,
        this.eventVenue.trim(),
        this.eventCapacity
      )
      .subscribe({

        next: () => {

          this.successMessage.set(
            'Event created successfully.'
          );

          this.resetAddForm();

          this.isSaving.set(false);

          this.loadEvents();

        },

        error: (error: any) => {

          console.error(
            'Error creating event:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ||
            'Unable to create event.'
          );

          this.isSaving.set(false);

        }

      });

  }


  // =====================================================
  // START EDIT
  // =====================================================

  startEdit(event: any): void {

    this.clearMessages();

    this.editingEventId.set(
      event.id
    );

    this.editTitle =
      event.title ?? '';

    this.editDescription =
      event.description ?? '';

    this.editDate =
      this.formatDateForInput(
        event.eventDate
      );

    this.editVenue =
      event.venue ?? '';

    this.editCapacity =
      event.capacity ?? null;

    this.editIsActive =
      event.isActive === true;

  }


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  cancelEdit(): void {

    this.editingEventId.set(null);

    this.editTitle = '';

    this.editDescription = '';

    this.editDate = '';

    this.editVenue = '';

    this.editCapacity = null;

    this.editIsActive = true;

  }


  // =====================================================
  // SAVE EDIT
  // =====================================================

  saveEdit(event: any): void {

    this.clearMessages();


    if (
      !this.editTitle.trim() ||
      !this.editDescription.trim() ||
      !this.editDate ||
      !this.editVenue.trim() ||
      !this.editCapacity ||
      this.editCapacity <= 0
    ) {

      this.errorMessage.set(
        'Please fill all event details correctly.'
      );

      return;

    }


    this.updatingEventId.set(
      event.id
    );


    this.eventService
      .updateEvent(
        event.id,
        this.editTitle.trim(),
        this.editDescription.trim(),
        this.editDate,
        this.editVenue.trim(),
        this.editCapacity,
        this.editIsActive
      )
      .subscribe({

        next: () => {

          this.successMessage.set(
            'Event updated successfully.'
          );

          this.cancelEdit();

          this.updatingEventId.set(null);

          this.loadEvents();

        },

        error: (error: any) => {

          console.error(
            'Error updating event:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ||
            'Unable to update event.'
          );

          this.updatingEventId.set(null);

        }

      });

  }


  // =====================================================
  // ACTIVATE / DEACTIVATE
  // =====================================================

  toggleEventStatus(
    event: any
  ): void {

    this.clearMessages();


    const newStatus =
      !event.isActive;


    this.updatingEventId.set(
      event.id
    );


    this.eventService
      .updateEventStatus(
        event,
        newStatus
      )
      .subscribe({

        next: () => {

          this.successMessage.set(
            newStatus
              ? 'Event activated successfully.'
              : 'Event deactivated successfully.'
          );

          this.updatingEventId.set(null);

          this.loadEvents();

        },

        error: (error: any) => {

          console.error(
            'Error updating event status:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ||
            'Unable to update event status.'
          );

          this.updatingEventId.set(null);

        }

      });

  }


  // =====================================================
  // HELPERS
  // =====================================================

  isEditing(
    eventId: number
  ): boolean {

    return (
      this.editingEventId() ===
      eventId
    );

  }


  isUpdating(
    eventId: number
  ): boolean {

    return (
      this.updatingEventId() ===
      eventId
    );

  }


  resetAddForm(): void {

    this.eventTitle = '';

    this.eventDescription = '';

    this.eventDate = '';

    this.eventVenue = '';

    this.eventCapacity = null;

  }


  clearMessages(): void {

    this.errorMessage.set('');

    this.successMessage.set('');

  }


  formatDateForInput(
    dateValue: string
  ): string {

    if (!dateValue) {
      return '';
    }

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '';
    }

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        '0'
      );

    const day =
      String(
        date.getDate()
      ).padStart(
        2,
        '0'
      );

    const hours =
      String(
        date.getHours()
      ).padStart(
        2,
        '0'
      );

    const minutes =
      String(
        date.getMinutes()
      ).padStart(
        2,
        '0'
      );

    return (
      `${year}-${month}-${day}` +
      `T${hours}:${minutes}`
    );

  }

}