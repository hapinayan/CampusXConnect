import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { finalize } from 'rxjs';

import { LabService } from '../../../../core/services/lab.service';

import {
  Lab,
  LabBooking,
  CreateLabBooking,
  AvailableSlot
} from '../../../../core/models/lab';


@Component({
  selector: 'app-lab-booking',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './lab-booking.html',
  styleUrl: './lab-booking.css'
})
export class LabBookingPage implements OnInit {

  // =====================================================
  // STUDENT PROFILE
  // =====================================================

  student: {
    fullName: string;
  } | null = null;


  // =====================================================
  // LABS
  // =====================================================

  labs: Lab[] = [];

  labsLoading = true;


  // =====================================================
  // SELECTED LAB
  // =====================================================

  selectedLabId: number | null = null;


  // =====================================================
  // BOOKING DETAILS
  // =====================================================

  bookingDate = '';

  startTime = '';

  endTime = '';


  // =====================================================
  // AVAILABLE SLOTS
  // =====================================================

  availableSlots: AvailableSlot[] = [];

  slotsLoading = false;


  // =====================================================
  // MY BOOKINGS
  // =====================================================

  bookings: LabBooking[] = [];

  bookingsLoading = true;


  // =====================================================
  // UI STATES
  // =====================================================

  submitting = false;

  errorMessage = '';

  successMessage = '';


  // =====================================================
  // CANCEL POPUP
  // =====================================================

  showCancelPopup = false;

  selectedBookingId: number | null = null;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private labService: LabService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  ngOnInit(): void {

    console.log(
      'Lab Booking Page initialized'
    );


    // Load logged-in student
    this.loadStudentProfile();


    // Load laboratories
    this.loadLabs();


    // Show default time slots
    this.availableSlots =
      this.labService.getDefaultTimeSlots();


    // Load student's bookings
    this.loadStudentBookings();

  }


  // =====================================================
  // LOAD STUDENT PROFILE
  // =====================================================

  loadStudentProfile(): void {

    try {

      /*
       * First try complete student object
       */

      const storedStudent =
        localStorage.getItem('student');


      if (storedStudent) {

        const parsedStudent =
          JSON.parse(storedStudent);


        if (
          parsedStudent &&
          parsedStudent.fullName
        ) {

          this.student = {
            fullName:
              parsedStudent.fullName
          };


          console.log(
            'Student loaded:',
            this.student
          );


          this.cdr.detectChanges();

          return;

        }

      }


      /*
       * Try direct fullName
       */

      const fullName =
        localStorage.getItem('fullName');


      if (fullName) {

        this.student = {
          fullName: fullName
        };


        console.log(
          'Student name loaded from localStorage:',
          fullName
        );


        this.cdr.detectChanges();

        return;

      }


      /*
       * Try studentName
       */

      const studentName =
        localStorage.getItem('studentName');


      if (studentName) {

        this.student = {
          fullName: studentName
        };


        console.log(
          'Student name loaded:',
          studentName
        );


        this.cdr.detectChanges();

        return;

      }


      /*
       * No name found
       */

      this.student = null;


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


      this.student = null;


      this.cdr.detectChanges();

    }

  }


  // =====================================================
  // LOAD ALL LABS
  // =====================================================

  loadLabs(): void {

    this.labsLoading = true;


    this.labService
      .getLabs()
      .pipe(

        finalize(() => {

          this.labsLoading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (data) => {

          console.log(
            'Labs loaded:',
            data
          );


          this.labs =
            data || [];


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load labs:',
            error
          );


          this.labs = [];


          this.errorMessage =
            'Unable to load laboratories.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD STUDENT BOOKINGS
  // =====================================================

  loadStudentBookings(): void {

    const storedStudentId =
      localStorage.getItem(
        'studentId'
      );


    console.log(
      'Stored Student ID:',
      storedStudentId
    );


    // No student ID
    if (!storedStudentId) {

      console.warn(
        'Student ID not found in localStorage.'
      );


      this.bookings = [];

      this.bookingsLoading = false;

      this.cdr.detectChanges();

      return;

    }


    const studentId =
      Number(storedStudentId);


    // Invalid student ID
    if (!studentId) {

      console.warn(
        'Invalid Student ID.'
      );


      this.bookings = [];

      this.bookingsLoading = false;

      this.cdr.detectChanges();

      return;

    }


    // Load bookings
    this.loadMyBookings(
      studentId
    );

  }


  // =====================================================
  // LAB CHANGE
  // =====================================================

  onLabChange(): void {

    console.log(
      'Selected Lab:',
      this.selectedLabId
    );


    this.errorMessage = '';

    this.successMessage = '';


    // Clear selected time
    this.startTime = '';

    this.endTime = '';


    // No lab selected
    if (!this.selectedLabId) {

      this.availableSlots =
        this.labService.getDefaultTimeSlots();

      this.cdr.detectChanges();

      return;

    }


    // Lab selected but date not selected
    if (!this.bookingDate) {

      this.availableSlots =
        this.labService.getDefaultTimeSlots();

      this.cdr.detectChanges();

      return;

    }


    // Load live availability
    this.loadAvailableSlots();

  }


  // =====================================================
  // DATE CHANGE
  // =====================================================

  onDateChange(): void {

    console.log(
      'Selected Date:',
      this.bookingDate
    );


    this.errorMessage = '';

    this.successMessage = '';


    // Clear selected time
    this.startTime = '';

    this.endTime = '';


    // Date not selected
    if (!this.bookingDate) {

      this.availableSlots =
        this.labService.getDefaultTimeSlots();

      this.cdr.detectChanges();

      return;

    }


    // Date selected but lab not selected
    if (!this.selectedLabId) {

      this.availableSlots =
        this.labService.getDefaultTimeSlots();

      this.cdr.detectChanges();

      return;

    }


    // Load live slots
    this.loadAvailableSlots();

  }


  // =====================================================
  // LOAD AVAILABLE SLOTS
  // =====================================================

  loadAvailableSlots(): void {

    if (
      !this.selectedLabId ||
      !this.bookingDate
    ) {

      this.availableSlots =
        this.labService.getDefaultTimeSlots();

      this.cdr.detectChanges();

      return;

    }


    console.log(
      'Loading slots:',
      this.selectedLabId,
      this.bookingDate
    );


    this.slotsLoading = true;

    this.availableSlots = [];


    this.labService
      .getAvailableSlots(
        this.selectedLabId,
        this.bookingDate
      )
      .pipe(

        finalize(() => {

          this.slotsLoading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (data) => {

          console.log(
            'API Available Slots:',
            data
          );


          if (
            Array.isArray(data) &&
            data.length > 0
          ) {

            this.availableSlots =
              data;

          }

          else {

            this.availableSlots =
              this.labService
                .getDefaultTimeSlots();

          }


          this.cdr.detectChanges();

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error) => {

          console.error(
            'Failed to load available slots:',
            error
          );


          this.availableSlots =
            this.labService
              .getDefaultTimeSlots();


          this.errorMessage =
            'Unable to check live availability. Default time slots are shown.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // SELECT TIME SLOT
  // =====================================================

  selectSlot(
    slot: AvailableSlot
  ): void {

    console.log(
      'Selected slot:',
      slot
    );


    this.errorMessage = '';

    this.successMessage = '';


    // Check full slot
    if (
      slot.isAvailable === false
    ) {

      this.errorMessage =
        'This time slot is no longer available.';

      return;

    }


    // Set start time
    this.startTime =
      this.formatTime(
        slot.startTime
      );


    // Set end time
    this.endTime =
      this.formatTime(
        slot.endTime
      );


    console.log(
      'Selected time:',
      this.startTime,
      '-',
      this.endTime
    );


    this.cdr.detectChanges();

  }


  // =====================================================
  // FORMAT TIME
  // =====================================================

  private formatTime(
    time: string
  ): string {

    if (!time) {

      return '';

    }


    return time.length >= 5
      ? time.substring(0, 5)
      : time;

  }


  // =====================================================
  // BOOK LABORATORY
  // =====================================================

  bookLab(): void {

    this.errorMessage = '';

    this.successMessage = '';


    // Validation
    if (!this.selectedLabId) {

      this.errorMessage =
        'Please select a laboratory.';

      return;

    }


    if (!this.bookingDate) {

      this.errorMessage =
        'Please select a booking date.';

      return;

    }


    if (!this.startTime) {

      this.errorMessage =
        'Please select an available time slot.';

      return;

    }


    if (!this.endTime) {

      this.errorMessage =
        'Please select an available time slot.';

      return;

    }


    if (
      this.startTime >=
      this.endTime
    ) {

      this.errorMessage =
        'End time must be after start time.';

      return;

    }


    // Prevent double click
    if (this.submitting) {

      return;

    }


    this.submitting = true;


    // Create booking request
    const booking: CreateLabBooking = {

      labId:
        this.selectedLabId,

      bookingDate:
        `${this.bookingDate}T00:00:00`,

      startTime:
        `${this.startTime}:00`,

      endTime:
        `${this.endTime}:00`

    };


    console.log(
      'Booking request:',
      booking
    );


    // Send API request
    this.labService
      .bookLab(booking)
      .pipe(

        finalize(() => {

          this.submitting = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (response) => {

          console.log(
            'Booking successful:',
            response
          );


          this.successMessage =
            'Lab booked successfully! Your reservation has been confirmed.';

          this.errorMessage = '';


          // Save student ID
          if (
            response &&
            response.studentId
          ) {

            localStorage.setItem(
              'studentId',
              response.studentId.toString()
            );

          }


          // Clear selected time
          this.startTime = '';

          this.endTime = '';


          // Refresh bookings
          const storedStudentId =
            localStorage.getItem(
              'studentId'
            );


          if (storedStudentId) {

            const studentId =
              Number(storedStudentId);


            if (studentId) {

              this.loadMyBookings(
                studentId
              );

            }

          }


          // Refresh slots
          if (
            this.selectedLabId &&
            this.bookingDate
          ) {

            this.loadAvailableSlots();

          }


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
            'Lab booking failed:',
            error
          );


          this.successMessage = '';


          if (
            error.status === 400
          ) {

            this.errorMessage =
              error.error?.message ||
              error.error?.title ||
              'Invalid booking details.';

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
              'This time slot is already full or booked.';


            if (
              this.selectedLabId &&
              this.bookingDate
            ) {

              this.loadAvailableSlots();

            }

          }

          else {

            this.errorMessage =
              'Unable to book the laboratory. Please try again.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD MY BOOKINGS
  // =====================================================

  loadMyBookings(
    studentId: number
  ): void {

    if (!studentId) {

      this.bookings = [];

      this.bookingsLoading = false;

      this.cdr.detectChanges();

      return;

    }


    console.log(
      'Loading bookings for student:',
      studentId
    );


    this.bookingsLoading = true;


    this.cdr.detectChanges();


    this.labService
      .getMyBookings(studentId)
      .pipe(

        finalize(() => {

          this.bookingsLoading = false;

          console.log(
            'Bookings loading finished.'
          );


          this.cdr.detectChanges();

        })

      )
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (data) => {

          console.log(
            'MY BOOKINGS API RESPONSE:',
            data
          );


          this.bookings =
            Array.isArray(data)
              ? data
              : [];


          console.log(
            'BOOKINGS STORED IN UI:',
            this.bookings
          );


          this.cdr.detectChanges();

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error) => {

          console.error(
            'Failed to load bookings:',
            error
          );


          this.bookings = [];

          this.bookingsLoading = false;


          if (
            error.status !== 404
          ) {

            this.errorMessage =
              'Unable to load your bookings.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // OPEN CANCEL POPUP
  // =====================================================

  cancelBooking(
    bookingId: number
  ): void {

    console.log(
      'Opening cancel popup for booking:',
      bookingId
    );


    this.errorMessage = '';

    this.successMessage = '';


    // Store booking ID
    this.selectedBookingId =
      bookingId;


    // Open popup
    this.showCancelPopup = true;


    this.cdr.detectChanges();

  }


  // =====================================================
  // CLOSE CANCEL POPUP
  // =====================================================

  closeCancelPopup(): void {

    console.log(
      'Cancel popup closed'
    );


    this.showCancelPopup = false;

    this.selectedBookingId = null;


    this.cdr.detectChanges();

  }


  // =====================================================
  // CONFIRM CANCEL BOOKING
  // =====================================================

  confirmCancelBooking(): void {

    // No booking selected
    if (
      this.selectedBookingId === null
    ) {

      return;

    }


    const bookingId =
      this.selectedBookingId;


    console.log(
      'Confirming cancellation:',
      bookingId
    );


    // Close popup
    this.showCancelPopup = false;

    this.selectedBookingId = null;


    this.errorMessage = '';

    this.successMessage = '';


    // Cancel API
    this.labService
      .cancelBooking(bookingId)
      .pipe(

        finalize(() => {

          // Refresh available slots
          if (
            this.selectedLabId &&
            this.bookingDate
          ) {

            this.loadAvailableSlots();

          }


          this.cdr.detectChanges();

        })

      )
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: () => {

          console.log(
            'Booking cancelled successfully:',
            bookingId
          );


          this.successMessage =
            'Lab booking cancelled successfully.';


          // Remove booking immediately
          this.bookings =
            this.bookings.filter(
              booking =>
                booking.id !== bookingId
            );


          // Clear selected time
          this.startTime = '';

          this.endTime = '';


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
            'Cancel booking failed:',
            error
          );


          if (
            error.status === 401
          ) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          }

          else if (
            error.status === 404
          ) {

            this.errorMessage =
              'Booking not found.';

          }

          else {

            this.errorMessage =
              'Unable to cancel the booking.';

          }


          this.cdr.detectChanges();

        }

      });

  }

}