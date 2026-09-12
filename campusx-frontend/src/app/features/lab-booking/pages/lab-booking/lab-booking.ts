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
import { NotificationService } from '../../../../core/services/notification.service';

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
  // NOTIFICATION COUNT
  // =====================================================

  unreadCount = 0;


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
  // CUSTOM CALENDAR
  // =====================================================

  showCalendar = false;

  calendarViewDate =
    new Date();

  calendarDays: {
    date: Date;
    day: number;
    currentMonth: boolean;
    isToday: boolean;
    selected: boolean;
    disabled: boolean;
  }[] = [];

  weekDays = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];


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
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  ngOnInit(): void {

    console.log(
      'Lab Booking Page initialized'
    );


    this.loadStudentProfile();

    this.loadUnreadNotificationCount();

    this.loadLabs();


    this.availableSlots =
      this.labService.getDefaultTimeSlots();


    this.buildCalendar();


    this.loadStudentBookings();

  }


  // =====================================================
  // LOAD STUDENT PROFILE
  // =====================================================

  loadStudentProfile(): void {

    try {

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
  // LOAD UNREAD NOTIFICATION COUNT
  // =====================================================

  loadUnreadNotificationCount(): void {

    const storedStudentId =
      localStorage.getItem('studentId');


    console.log(
      'Lab Booking notification Student ID:',
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
            'Lab Booking unread notifications:',
            this.unreadCount
          );


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load Lab Booking notification count:',
            error
          );


          this.unreadCount = 0;

          this.cdr.detectChanges();

        }

      });

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


    if (!studentId) {

      console.warn(
        'Invalid Student ID.'
      );


      this.bookings = [];

      this.bookingsLoading = false;

      this.cdr.detectChanges();

      return;

    }


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


    this.startTime = '';

    this.endTime = '';


    if (!this.selectedLabId) {

      this.availableSlots =
        this.labService.getDefaultTimeSlots();

      this.cdr.detectChanges();

      return;

    }


    if (!this.bookingDate) {

      this.availableSlots =
        this.labService.getDefaultTimeSlots();

      this.cdr.detectChanges();

      return;

    }


    this.loadAvailableSlots();

  }


  // =====================================================
  // TOGGLE CALENDAR
  // =====================================================

  toggleCalendar(): void {

    this.showCalendar =
      !this.showCalendar;


    if (this.showCalendar) {

      if (this.bookingDate) {

        const selectedDate =
          new Date(
            `${this.bookingDate}T00:00:00`
          );


        if (
          !isNaN(
            selectedDate.getTime()
          )
        ) {

          this.calendarViewDate =
            new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              1
            );

        }

      }

      else {

        const today =
          new Date();


        this.calendarViewDate =
          new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );

      }


      this.buildCalendar();

    }


    this.cdr.detectChanges();

  }


  // =====================================================
  // CLOSE CALENDAR
  // =====================================================

  closeCalendar(): void {

    this.showCalendar = false;

    this.cdr.detectChanges();

  }


  // =====================================================
  // CALENDAR MONTH TITLE
  // =====================================================

  get calendarMonthTitle(): string {

    return this.calendarViewDate
      .toLocaleDateString(
        'en-US',
        {
          month: 'long',
          year: 'numeric'
        }
      );

  }


  // =====================================================
  // PREVIOUS MONTH
  // =====================================================

  previousMonth(): void {

    this.calendarViewDate =
      new Date(
        this.calendarViewDate.getFullYear(),
        this.calendarViewDate.getMonth() - 1,
        1
      );


    this.buildCalendar();

  }


  // =====================================================
  // NEXT MONTH
  // =====================================================

  nextMonth(): void {

    this.calendarViewDate =
      new Date(
        this.calendarViewDate.getFullYear(),
        this.calendarViewDate.getMonth() + 1,
        1
      );


    this.buildCalendar();

  }


  // =====================================================
  // BUILD CALENDAR
  // =====================================================

  buildCalendar(): void {

    const year =
      this.calendarViewDate.getFullYear();

    const month =
      this.calendarViewDate.getMonth();


    const firstDay =
      new Date(
        year,
        month,
        1
      );


    const startDayIndex =
      firstDay.getDay();


    const calendarStart =
      new Date(
        year,
        month,
        1 - startDayIndex
      );


    const today =
      this.getStartOfDay(
        new Date()
      );


    const days: {
      date: Date;
      day: number;
      currentMonth: boolean;
      isToday: boolean;
      selected: boolean;
      disabled: boolean;
    }[] = [];


    for (
      let index = 0;
      index < 42;
      index++
    ) {

      const date =
        new Date(
          calendarStart
        );


      date.setDate(
        calendarStart.getDate() +
        index
      );


      const normalizedDate =
        this.getStartOfDay(
          date
        );


      const formattedDate =
        this.formatDateForApi(
          date
        );


      days.push({

        date:
          new Date(date),

        day:
          date.getDate(),

        currentMonth:
          date.getMonth() === month,

        isToday:
          normalizedDate.getTime() ===
          today.getTime(),

        selected:
          this.bookingDate ===
          formattedDate,

        disabled:
          normalizedDate.getTime() <
          today.getTime()

      });

    }


    this.calendarDays =
      days;


    this.cdr.detectChanges();

  }


  // =====================================================
  // SELECT CALENDAR DATE
  // =====================================================

  selectCalendarDate(
    day: {
      date: Date;
      day: number;
      currentMonth: boolean;
      isToday: boolean;
      selected: boolean;
      disabled: boolean;
    }
  ): void {

    if (day.disabled) {

      return;

    }


    this.bookingDate =
      this.formatDateForApi(
        day.date
      );


    this.calendarViewDate =
      new Date(
        day.date.getFullYear(),
        day.date.getMonth(),
        1
      );


    this.showCalendar = false;


    this.buildCalendar();


    this.onDateChange();

  }


  // =====================================================
  // SELECT TODAY
  // =====================================================

  selectToday(): void {

    const today =
      new Date();


    this.bookingDate =
      this.formatDateForApi(
        today
      );


    this.calendarViewDate =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );


    this.showCalendar = false;


    this.buildCalendar();


    this.onDateChange();

  }


  // =====================================================
  // CLEAR BOOKING DATE
  // =====================================================

  clearBookingDate(): void {

    this.bookingDate = '';

    this.startTime = '';

    this.endTime = '';


    this.availableSlots =
      this.labService
        .getDefaultTimeSlots();


    this.buildCalendar();


    this.showCalendar = false;


    this.cdr.detectChanges();

  }


  // =====================================================
  // DISPLAY BOOKING DATE
  // =====================================================

  get bookingDateDisplay(): string {

    if (!this.bookingDate) {

      return 'Select booking date';

    }


    const date =
      new Date(
        `${this.bookingDate}T00:00:00`
      );


    if (
      isNaN(
        date.getTime()
      )
    ) {

      return this.bookingDate;

    }


    return date.toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  // =====================================================
  // DATE HELPERS
  // =====================================================

  private getStartOfDay(
    date: Date
  ): Date {

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

  }


  private formatDateForApi(
    date: Date
  ): string {

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


    return `${year}-${month}-${day}`;

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


    this.startTime = '';

    this.endTime = '';


    if (!this.bookingDate) {

      this.availableSlots =
        this.labService.getDefaultTimeSlots();

      this.cdr.detectChanges();

      return;

    }


    if (!this.selectedLabId) {

      this.availableSlots =
        this.labService.getDefaultTimeSlots();

      this.cdr.detectChanges();

      return;

    }


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


    if (
      slot.isAvailable === false
    ) {

      this.errorMessage =
        'This time slot is no longer available.';

      return;

    }


    this.startTime =
      this.formatTime(
        slot.startTime
      );


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


    if (this.submitting) {

      return;

    }


    this.submitting = true;


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


    this.labService
      .bookLab(booking)
      .pipe(

        finalize(() => {

          this.submitting = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (response) => {

          console.log(
            'Booking successful:',
            response
          );


          this.successMessage =
            'Lab booked successfully! Your reservation has been confirmed.';

          this.errorMessage = '';


          if (
            response &&
            response.studentId
          ) {

            localStorage.setItem(
              'studentId',
              response.studentId.toString()
            );

          }


          this.startTime = '';

          this.endTime = '';


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


          if (
            this.selectedLabId &&
            this.bookingDate
          ) {

            this.loadAvailableSlots();

          }


          this.cdr.detectChanges();


          setTimeout(() => {

            this.successMessage = '';

            this.cdr.detectChanges();

          }, 5000);

        },


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


    this.selectedBookingId =
      bookingId;


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


    this.showCancelPopup = false;

    this.selectedBookingId = null;


    this.errorMessage = '';

    this.successMessage = '';


    this.labService
      .cancelBooking(bookingId)
      .pipe(

        finalize(() => {

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

        next: () => {

          console.log(
            'Booking cancelled successfully:',
            bookingId
          );


          this.successMessage =
            'Lab booking cancelled successfully.';


          this.bookings =
            this.bookings.filter(
              booking =>
                booking.id !== bookingId
            );


          this.startTime = '';

          this.endTime = '';


          this.cdr.detectChanges();


          setTimeout(() => {

            this.successMessage = '';

            this.cdr.detectChanges();

          }, 5000);

        },


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