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

import {
  Room
} from '../../../../core/models/hostel';

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

  // =====================================================
  // DATA
  // =====================================================

  applications = signal<any[]>([]);

  rooms = signal<Room[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');

  updatingApplicationId =
    signal<number | null>(null);

  assigningApplicationId =
    signal<number | null>(null);

  selectedRoomIds =
    signal<Record<number, number | null>>({});


  // =====================================================
  // COUNTS
  // =====================================================

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


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private hostelService: HostelService
  ) {}


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  ngOnInit(): void {

    this.loadApplications();

    this.loadRooms();

  }


  // =====================================================
  // LOAD APPLICATIONS
  // =====================================================

  loadApplications(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.hostelService
      .getAdminHostelApplications()
      .subscribe({

        next: (applications: any[]) => {

          this.applications.set(
            Array.isArray(applications)
              ? applications
              : []
          );

          this.isLoading.set(false);

          console.log(
            'Admin hostel applications loaded:',
            applications
          );

        },

        error: (error: any) => {

          console.error(
            'Error loading hostel applications:',
            error
          );

          this.errorMessage.set(
            error.error?.message ||
            'Unable to load hostel applications.'
          );

          this.isLoading.set(false);

        }

      });

  }


  // =====================================================
  // LOAD ROOMS
  // =====================================================

  loadRooms(): void {

    this.hostelService
      .getAdminRooms()
      .subscribe({

        next: (rooms: Room[]) => {

          this.rooms.set(
            Array.isArray(rooms)
              ? rooms
              : []
          );

          console.log(
            'Admin rooms loaded:',
            rooms
          );

        },

        error: (error: any) => {

          console.error(
            'Error loading rooms:',
            error
          );

        }

      });

  }


  // =====================================================
  // APPROVE APPLICATION
  // =====================================================

  approveApplication(
    applicationId: number
  ): void {

    this.updateApplicationStatus(
      applicationId,
      1
    );

  }


  // =====================================================
  // REJECT APPLICATION
  // =====================================================

  rejectApplication(
    applicationId: number
  ): void {

    this.updateApplicationStatus(
      applicationId,
      2
    );

  }


  // =====================================================
  // UPDATE APPLICATION STATUS
  // =====================================================

  updateApplicationStatus(
    applicationId: number,
    status: number
  ): void {

    if (
      this.updatingApplicationId() !== null
    ) {
      return;
    }

    this.updatingApplicationId.set(
      applicationId
    );

    this.errorMessage.set('');

    this.hostelService
      .updateHostelApplicationStatus(
        applicationId,
        status
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Hostel application status updated:',
            response
          );

          this.updatingApplicationId.set(
            null
          );

          this.loadApplications();

        },

        error: (error: any) => {

          console.error(
            'Failed to update hostel application status:',
            error
          );

          this.updatingApplicationId.set(
            null
          );

          this.errorMessage.set(
            error.error?.message ||
            'Unable to update hostel application status.'
          );

        }

      });

  }


  // =====================================================
  // ROOM SELECT
  // =====================================================

  onRoomSelected(
    applicationId: number,
    roomId: number | null
  ): void {

    this.selectedRoomIds.update(
      current => ({
        ...current,
        [applicationId]: roomId
      })
    );

  }


  // =====================================================
  // GET SELECTED ROOM
  // =====================================================

  getSelectedRoomId(
    applicationId: number
  ): number | null {

    return (
      this.selectedRoomIds()[applicationId]
      ?? null
    );

  }


  // =====================================================
  // ASSIGN ROOM
  // =====================================================

  assignSelectedRoom(
    applicationId: number
  ): void {

    const roomId =
      this.getSelectedRoomId(
        applicationId
      );

    if (!roomId) {

      this.errorMessage.set(
        'Please select a room first.'
      );

      return;

    }

    this.assigningApplicationId.set(
      applicationId
    );

    this.errorMessage.set('');

    this.hostelService
      .assignRoom(
        applicationId,
        roomId
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Room assigned successfully:',
            response
          );

          this.assigningApplicationId.set(
            null
          );

          this.selectedRoomIds.update(
            current => ({
              ...current,
              [applicationId]: null
            })
          );

          this.loadApplications();

        },

        error: (error: any) => {

          console.error(
            'Failed to assign room:',
            error
          );

          this.assigningApplicationId.set(
            null
          );

          this.errorMessage.set(
            error.error?.message ||
            'Unable to assign room.'
          );

        }

      });

  }


  // =====================================================
  // HELPERS
  // =====================================================

  isUpdating(
    applicationId: number
  ): boolean {

    return (
      this.updatingApplicationId() ===
      applicationId
    );

  }


  isAssigning(
    applicationId: number
  ): boolean {

    return (
      this.assigningApplicationId() ===
      applicationId
    );

  }

}