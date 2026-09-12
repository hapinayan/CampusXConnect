import {
  Component,
  OnInit,
  signal,
  computed
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  LabService
} from '../../../../core/services/lab.service';

import {
  Lab
} from '../../../../core/models/lab';


@Component({
  selector: 'app-admin-labs',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './admin-labs.html',
  styleUrl: './admin-labs.css'
})
export class AdminLabs implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  labs = signal<Lab[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');

  successMessage = signal('');


  // =====================================================
  // FORM
  // =====================================================

  labName = '';

  labLocation = '';

  labCapacity: number | null = null;


  // =====================================================
  // EDIT STATE
  // =====================================================

  editingLabId =
    signal<number | null>(null);

  editName = '';

  editLocation = '';

  editCapacity: number | null = null;

  editIsActive = true;


  // =====================================================
  // ACTION STATE
  // =====================================================

  isSaving =
    signal(false);

  updatingLabId =
    signal<number | null>(null);


  // =====================================================
  // COUNTS
  // =====================================================

  totalLabs = computed(() =>
    this.labs().length
  );


  activeLabs = computed(() =>
    this.labs().filter(
      lab =>
        lab.isActive === true
    ).length
  );


  inactiveLabs = computed(() =>
    this.labs().filter(
      lab =>
        lab.isActive === false
    ).length
  );


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private labService: LabService
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadLabs();

  }


  // =====================================================
  // LOAD LABS
  // =====================================================

  loadLabs(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.labService
      .getLabs()
      .subscribe({

        next: (labs: Lab[]) => {

          this.labs.set(
            Array.isArray(labs)
              ? labs
              : []
          );

          this.isLoading.set(false);

          console.log(
            'Labs loaded:',
            labs
          );

        },

        error: (error: any) => {

          console.error(
            'Error loading labs:',
            error
          );

          this.errorMessage.set(
            error.error?.message ||
            'Unable to load laboratories.'
          );

          this.isLoading.set(false);

        }

      });

  }


  // =====================================================
  // REFRESH LABS
  // =====================================================

  refreshLabs(): void {

    this.labService
      .clearLabsCache();

    this.loadLabs();

  }


  // =====================================================
  // CREATE LAB
  // =====================================================

  addLab(): void {

    this.errorMessage.set('');

    this.successMessage.set('');


    if (
      !this.labName.trim() ||
      !this.labLocation.trim() ||
      !this.labCapacity ||
      this.labCapacity <= 0
    ) {

      this.errorMessage.set(
        'Please enter valid laboratory details.'
      );

      return;

    }


    this.isSaving.set(true);


    this.labService
      .createLab(
        this.labName.trim(),
        this.labLocation.trim(),
        this.labCapacity
      )
      .subscribe({

        next: () => {

          this.isSaving.set(false);

          this.successMessage.set(
            'Laboratory added successfully.'
          );

          this.resetAddForm();

          this.refreshLabs();

        },

        error: (error: any) => {

          console.error(
            'Failed to add lab:',
            error
          );

          this.isSaving.set(false);

          this.errorMessage.set(
            error.error?.message ||
            'Unable to add laboratory.'
          );

        }

      });

  }


  // =====================================================
  // START EDIT
  // =====================================================

  startEdit(
    lab: Lab
  ): void {

    this.editingLabId.set(
      lab.id
    );

    this.editName =
      lab.name;

    this.editLocation =
      lab.location;

    this.editCapacity =
      lab.capacity;

    this.editIsActive =
      lab.isActive;

    this.errorMessage.set('');

    this.successMessage.set('');

  }


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  cancelEdit(): void {

    this.editingLabId.set(
      null
    );

    this.editName = '';

    this.editLocation = '';

    this.editCapacity = null;

    this.editIsActive = true;

  }


  // =====================================================
  // SAVE EDIT
  // =====================================================

  saveEdit(
    labId: number
  ): void {

    this.errorMessage.set('');

    this.successMessage.set('');


    if (
      !this.editName.trim() ||
      !this.editLocation.trim() ||
      !this.editCapacity ||
      this.editCapacity <= 0
    ) {

      this.errorMessage.set(
        'Please enter valid laboratory details.'
      );

      return;

    }


    this.updatingLabId.set(
      labId
    );


    this.labService
      .updateLab(
        labId,
        this.editName.trim(),
        this.editLocation.trim(),
        this.editCapacity,
        this.editIsActive
      )
      .subscribe({

        next: () => {

          this.updatingLabId.set(
            null
          );

          this.successMessage.set(
            'Laboratory updated successfully.'
          );

          this.cancelEdit();

          this.refreshLabs();

        },

        error: (error: any) => {

          console.error(
            'Failed to update lab:',
            error
          );

          this.updatingLabId.set(
            null
          );

          this.errorMessage.set(
            error.error?.message ||
            'Unable to update laboratory.'
          );

        }

      });

  }


  // =====================================================
  // ACTIVATE / DEACTIVATE
  // =====================================================

  toggleLabStatus(
    lab: Lab
  ): void {

    if (
      this.updatingLabId() !== null
    ) {
      return;
    }


    this.errorMessage.set('');

    this.successMessage.set('');

    this.updatingLabId.set(
      lab.id
    );


    const newStatus =
      !lab.isActive;


    this.labService
      .updateLabStatus(
        lab,
        newStatus
      )
      .subscribe({

        next: () => {

          this.updatingLabId.set(
            null
          );

          this.successMessage.set(
            newStatus
              ? 'Laboratory activated successfully.'
              : 'Laboratory deactivated successfully.'
          );

          this.refreshLabs();

        },

        error: (error: any) => {

          console.error(
            'Failed to update lab status:',
            error
          );

          this.updatingLabId.set(
            null
          );

          this.errorMessage.set(
            error.error?.message ||
            'Unable to update laboratory status.'
          );

        }

      });

  }


  // =====================================================
  // HELPERS
  // =====================================================

  isEditing(
    labId: number
  ): boolean {

    return (
      this.editingLabId() ===
      labId
    );

  }


  isUpdating(
    labId: number
  ): boolean {

    return (
      this.updatingLabId() ===
      labId
    );

  }


  resetAddForm(): void {

    this.labName = '';

    this.labLocation = '';

    this.labCapacity = null;

  }

}