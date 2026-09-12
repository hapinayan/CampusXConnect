import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HostelService } from '../../../../core/services/hostel.service';

import {
  Hostel,
  HostelApplication
} from '../../../../core/models/hostel';

@Component({
  selector: 'app-hostel',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    DatePipe
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


  // =========================
  // CONSTRUCTOR
  // =========================

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

    this.hostelService
      .getHostels()
      .subscribe({

        next: (data) => {

          this.hostels = data;

          this.loading = false;

          console.log(
            'Hostels:',
            data
          );

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

    this.hostelService
      .getMyApplication()
      .subscribe({

        next: (data) => {

          this.application = data;

          console.log(
            'My hostel application:',
            data
          );

        },

        error: (error) => {

          console.log(
            'No hostel application found.',
            error
          );

          this.application = null;

        }

      });

  }


  // =========================
  // SUBMIT APPLICATION
  // =========================

  submitApplication(): void {

    // Clear old messages

    this.errorMessage = '';

    this.successMessage = '';


    // =========================
    // CHECK HOSTEL
    // =========================

    if (!this.selectedHostelId) {

      this.errorMessage =
        'Please select a hostel.';

      return;

    }


    // =========================
    // PREVENT DOUBLE CLICK
    // =========================

    if (this.submitting) {

      return;

    }


    // =========================
    // START SUBMITTING
    // =========================

    this.submitting = true;


    // =========================
    // API REQUEST
    // =========================

    this.hostelService
      .applyForHostel(
        this.selectedHostelId,
        this.preferences
      )
      .subscribe({

        // =========================
        // SUCCESS
        // =========================

        next: (response) => {

          console.log(
            'Hostel application submitted:',
            response
          );


          // Stop submitting

          this.submitting = false;


          // Success message

          this.successMessage =
            'Hostel application submitted successfully.';


          // Reload latest application

          this.loadMyApplication();


          // Clear form

          this.selectedHostelId = null;

          this.preferences = '';

        },


        // =========================
        // ERROR
        // =========================

        error: (error) => {

          console.error(
            'Hostel application failed:',
            error
          );


          // Stop submitting

          this.submitting = false;


          // =========================
          // 400
          // =========================

          if (error.status === 400) {

            this.errorMessage =
              error.error?.message ||
              'Unable to submit hostel application.';

          }


          // =========================
          // 401
          // =========================

          else if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }


          // =========================
          // 409
          // =========================

          else if (error.status === 409) {

            this.errorMessage =
              error.error?.message ||
              'You already have a hostel application.';

          }


          // =========================
          // OTHER ERRORS
          // =========================

          else {

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