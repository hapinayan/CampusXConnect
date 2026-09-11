import {
  Component,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { EventService } from '../../../../core/services/event.service';

@Component({
  selector: 'app-admin-events',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './admin-events.html',
  styleUrl: './admin-events.css'
})
export class AdminEvents implements OnInit {

  events = signal<any[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');


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

}