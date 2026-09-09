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

  hostelsLoading = true;


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

    this.hostelsLoading = true;

    this.hostelService
      .getHostels()
      .subscribe({

        next: (data) => {

          this.hostels = data;

          this.hostelsLoading = false;

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

          this.hostelsLoading = false;

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

    // Clear previous messages

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
    // API CALL
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


          // IMPORTANT
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


          // IMPORTANT
          // Stop submitting

          this.submitting = false;


          // 400

          if (error.status === 400) {

            this.errorMessage =
              error.error?.message ||
              'Unable to submit hostel application.';

          }


          // 401

          else if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }


          // 409

          else if (error.status === 409) {

            this.errorMessage =
              error.error?.message ||
              'You already have a hostel application.';

          }


          // Other errors

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