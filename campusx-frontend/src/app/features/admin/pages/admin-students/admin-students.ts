import {
  Component,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  StudentService,
  Student
} from '../../../../core/services/student';

@Component({
  selector: 'app-admin-students',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './admin-students.html',
  styleUrl: './admin-students.css'
})
export class AdminStudents implements OnInit {

  // =========================
  // DATA
  // =========================

  students = signal<Student[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');


  // =========================
  // COUNTS
  // =========================

  totalStudents = computed(() =>
    this.students().length
  );

  activeStudents = computed(() =>
    this.students().filter(
      student => student.isActive === true
    ).length
  );

  inactiveStudents = computed(() =>
    this.students().filter(
      student => student.isActive === false
    ).length
  );


  constructor(
    private studentService: StudentService
  ) {}


  ngOnInit(): void {
    this.loadStudents();
  }


  // =========================
  // LOAD STUDENTS
  // =========================

  loadStudents(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.studentService
      .getStudents()
      .subscribe({

        next: (students) => {

          this.students.set(students);

          this.isLoading.set(false);

          console.log(
            'Students loaded:',
            students
          );
        },


        error: (error) => {

          console.error(
            'Error loading students:',
            error
          );

          this.errorMessage.set(
            'Unable to load students.'
          );

          this.isLoading.set(false);
        }

      });

  }

}