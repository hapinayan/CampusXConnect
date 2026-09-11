import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LabService } from '../../../core/services/lab.service';

import {
  Lab,
  CreateLab,
  UpdateLab
} from '../../../core/models/lab';


@Component({
  selector: 'app-lab-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './lab-management.html',
  styleUrl: './lab-management.css'
})
export class LabManagement implements OnInit {

  // =====================================================
  // LAB DATA
  // =====================================================

  labs: Lab[] = [];

  isLoading = false;

  message = '';

  errorMessage = '';


  // =====================================================
  // SUMMARY COUNTS
  // =====================================================

  get activeLabCount(): number {

    return this.labs.filter(
      lab => lab.isActive
    ).length;

  }


  get inactiveLabCount(): number {

    return this.labs.filter(
      lab => !lab.isActive
    ).length;

  }


  // =====================================================
  // CREATE LAB FORM
  // =====================================================

  newLab: CreateLab = {

    name: '',

    location: '',

    capacity: 1

  };


  // =====================================================
  // EDIT LAB
  // =====================================================

  selectedLab: Lab | null = null;


  editLab: UpdateLab = {

    name: '',

    location: '',

    capacity: 1,

    isActive: true

  };


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private labService: LabService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // PAGE LOAD
  // =====================================================

  ngOnInit(): void {

    console.log('Lab Management loaded');

    this.loadLabs();

  }


  // =====================================================
  // LOAD ALL LABS
  // =====================================================

  loadLabs(): void {

    this.isLoading = true;

    this.message = '';

    this.errorMessage = '';


    this.labService
      .getLabs()
      .subscribe({

        next: (labs: Lab[]) => {

          console.log(
            'Labs received:',
            labs
          );

          this.labs = labs;

          this.isLoading = false;

          this.cdr.detectChanges();

        },


        error: (error: any) => {

          console.error(
            'Error loading labs:',
            error
          );

          this.errorMessage =
            'Unable to load laboratories.';

          this.isLoading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CREATE LAB
  // =====================================================

  createLab(): void {

    this.message = '';

    this.errorMessage = '';


    if (
      !this.newLab.name.trim() ||
      !this.newLab.location.trim() ||
      this.newLab.capacity <= 0
    ) {

      this.errorMessage =
        'Please enter valid laboratory details.';

      return;

    }


    this.labService
      .createLab(this.newLab)
      .subscribe({

        next: () => {

          this.message =
            'Laboratory created successfully.';


          this.newLab = {

            name: '',

            location: '',

            capacity: 1

          };


          this.loadLabs();

        },


        error: (error: any) => {

          console.error(
            'Error creating lab:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to create laboratory.';

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // SELECT LAB FOR EDIT
  // =====================================================

  selectLabForEdit(
    lab: Lab
  ): void {

    this.selectedLab = lab;


    this.editLab = {

      name: lab.name,

      location: lab.location,

      capacity: lab.capacity,

      isActive: lab.isActive

    };


    this.message = '';

    this.errorMessage = '';

  }


  // =====================================================
  // UPDATE LAB
  // =====================================================

  updateLab(): void {

    if (!this.selectedLab) {

      return;

    }


    this.message = '';

    this.errorMessage = '';


    if (
      !this.editLab.name.trim() ||
      !this.editLab.location.trim() ||
      this.editLab.capacity <= 0
    ) {

      this.errorMessage =
        'Please enter valid laboratory details.';

      return;

    }


    this.labService
      .updateLab(
        this.selectedLab.id,
        this.editLab
      )
      .subscribe({

        next: () => {

          this.message =
            'Laboratory updated successfully.';


          this.selectedLab = null;


          this.loadLabs();

        },


        error: (error: any) => {

          console.error(
            'Error updating lab:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to update laboratory.';

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  cancelEdit(): void {

    this.selectedLab = null;


    this.editLab = {

      name: '',

      location: '',

      capacity: 1,

      isActive: true

    };

  }


  // =====================================================
  // ACTIVATE / DEACTIVATE LAB
  // =====================================================

  toggleLabStatus(
    lab: Lab
  ): void {

    this.message = '';

    this.errorMessage = '';


    const updatedLab: UpdateLab = {

      name: lab.name,

      location: lab.location,

      capacity: lab.capacity,

      isActive: !lab.isActive

    };


    this.labService
      .updateLab(
        lab.id,
        updatedLab
      )
      .subscribe({

        next: () => {

          this.message =
            updatedLab.isActive
              ? 'Laboratory activated successfully.'
              : 'Laboratory deactivated successfully.';


          this.loadLabs();

        },


        error: (error: any) => {

          console.error(
            'Error updating lab status:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to update laboratory status.';

          this.cdr.detectChanges();

        }

      });

  }

}