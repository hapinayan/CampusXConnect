import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HostelService } from '../../../../core/services/hostel.service';
import { Hostel, HostelApplication } from '../../../../core/models/hostel';

@Component({
  selector: 'app-hostel',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './hostel.html',
  styleUrl: './hostel.css'
})
export class HostelPage implements OnInit {

  // =========================
  // HOSTELS
  // =========================

  hostels: Hostel[] = [];

  // =========================
  // SELECTED HOSTEL
  // =========================

  selectedHostelId: number | null = null;

  // =========================
  // PREFERENCES
  // =========================

  preferences = '';

  // =========================
  // APPLICATION
  // =========================

  application: HostelApplication | null = null;

  // =========================
  // UI STATES
  // =========================

  loading = true;

  submitting = false;

  errorMessage = '';

  successMessage = '';

  constructor(
    private hostelService: HostelService
  ) {}

  // =========================
  // INITIAL LOAD
  // =========================

  ngOnInit(): void {
    this.loadHostels();
    this.loadMyApplication();
  }

  // =========================
  // LOAD HOSTELS
  // =========================

  loadHostels(): void {

    this.hostelService.getHostels().subscribe({

      next: (data) => {

        this.hostels = data;

        this.loading = false;

        console.log('Hostels:', data);
      },

      error: (error) => {

        console.error(
          'Failed to load hostels:',
          error
        );

        this.loading = false;

        this.errorMessage =
          'Unable to load hostel information.';
      }

    });
  }

  // =========================
  // LOAD MY APPLICATION
  // =========================

  loadMyApplication(): void {

    this.hostelService.getMyApplication().subscribe({

      next: (data) => {

        this.application = data;

        console.log(
          'My hostel application:',
          data
        );
      },

      error: (error) => {

        console.log(
          'No hostel application found.'
        );

        this.application = null;
      }

    });
  }

  // =========================
  // SUBMIT APPLICATION
  // =========================

  submitApplication(): void {

    this.errorMessage = '';
    this.successMessage = '';

    // Check hostel
    if (!this.selectedHostelId) {

      this.errorMessage =
        'Please select a hostel.';

      return;
    }

    this.submitting = true;

    this.hostelService
      .applyForHostel(
        this.selectedHostelId,
        this.preferences
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Hostel application submitted:',
            response
          );

          this.successMessage =
            'Hostel application submitted successfully.';

          this.submitting = false;

          // Reload application
          this.loadMyApplication();

          // Clear form
          this.selectedHostelId = null;
          this.preferences = '';
        },

        error: (error) => {

          console.error(
            'Hostel application failed:',
            error
          );

          this.submitting = false;

          if (error.status === 400) {

            this.errorMessage =
              error.error?.message ||
              'Unable to submit hostel application.';

          } else if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          } else {

            this.errorMessage =
              'Something went wrong. Please try again.';
          }

        }

      });
  }

  // =========================
  // GET APPLICATION STATUS
  // =========================

  getApplicationStatus(): string {

    if (!this.application) {
      return 'No Application';
    }

    return this.application.status || 'Pending';
  }
}