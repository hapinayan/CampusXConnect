import {
  Component,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  HostelService
} from '../../../../core/services/hostel.service';

@Component({
  selector: 'app-admin-hostels',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './admin-hostels.html',
  styleUrl: './admin-hostels.css'
})
export class AdminHostels implements OnInit {

  applications = signal<any[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');


  // =========================
  // COUNTS
  // =========================

  totalApplications = computed(() =>
    this.applications().length
  );


  pendingApplications = computed(() =>
    this.applications().filter(
      application =>
        application.status === 'Pending'
    ).length
  );


  approvedApplications = computed(() =>
    this.applications().filter(
      application =>
        application.status === 'Approved'
    ).length
  );


  roomAssignedApplications = computed(() =>
    this.applications().filter(
      application =>
        application.status === 'RoomAssigned'
    ).length
  );


  constructor(
    private hostelService: HostelService
  ) {}


  ngOnInit(): void {

    this.loadApplications();

  }


  // =========================
  // LOAD APPLICATIONS
  // =========================

  loadApplications(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');


    this.hostelService
      .getAdminHostelApplications()
      .subscribe({

        next: (applications) => {

          this.applications.set(
            applications
          );

          this.isLoading.set(false);

          console.log(
            'Admin hostel applications loaded:',
            applications
          );

        },


        error: (error) => {

          console.error(
            'Error loading hostel applications:',
            error
          );

          this.errorMessage.set(
            'Unable to load hostel applications.'
          );

          this.isLoading.set(false);

        }

      });

  }

}