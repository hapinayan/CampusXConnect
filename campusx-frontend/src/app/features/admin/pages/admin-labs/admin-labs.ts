import {
  Component,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { LabService } from '../../../../core/services/lab.service';

@Component({
  selector: 'app-admin-labs',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './admin-labs.html',
  styleUrl: './admin-labs.css'
})
export class AdminLabs implements OnInit {

  labs = signal<any[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');


  totalLabs = computed(() =>
    this.labs().length
  );

  activeLabs = computed(() =>
    this.labs().filter(
      lab => lab.isActive === true
    ).length
  );

  inactiveLabs = computed(() =>
    this.labs().filter(
      lab => lab.isActive === false
    ).length
  );


  constructor(
    private labService: LabService
  ) {}


  ngOnInit(): void {
    this.loadLabs();
  }


  loadLabs(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.labService
      .getLabs()
      .subscribe({

        next: (labs: any[]) => {

          this.labs.set(labs);

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
            'Unable to load laboratories.'
          );

          this.isLoading.set(false);

        }

      });

  }

}