import {
  Component,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  StudentService,
  Student
} from '../../../../core/services/student';

@Component({
  selector: 'app-admin-students',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './admin-students.html',
  styleUrl: './admin-students.css'
})
export class AdminStudents implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  students = signal<Student[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');

  searchTerm = signal('');

  selectedFaculty = signal('All Faculties');


  // =====================================================
  // COUNTS
  // =====================================================

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


  // =====================================================
  // FILTERED STUDENTS
  // =====================================================

  filteredStudents = computed(() => {

    const search =
      this.searchTerm()
        .trim()
        .toLowerCase();

    const faculty =
      this.selectedFaculty();

    return this.students().filter(student => {

      const matchesSearch =
        !search ||

        student.fullName
          .toLowerCase()
          .includes(search) ||

        student.indexNumber
          .toLowerCase()
          .includes(search) ||

        (student.email ?? '')
          .toLowerCase()
          .includes(search) ||

        student.contactNumber
          .toLowerCase()
          .includes(search);

      const matchesFaculty =
        faculty === 'All Faculties' ||
        student.faculty === faculty;

      return (
        matchesSearch &&
        matchesFaculty
      );

    });

  });


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  ngOnInit(): void {

    this.loadStudents();

  }


  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  loadStudents(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.studentService
      .getStudents()
      .subscribe({

        next: (students) => {

          this.students.set(
            Array.isArray(students)
              ? students
              : []
          );

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

          this.students.set([]);

          this.errorMessage.set(
            error.error?.message ||
            'Unable to load students.'
          );

          this.isLoading.set(false);

        }

      });

  }


  // =====================================================
  // ADD STUDENT
  // =====================================================

  addStudent(): void {

    this.router.navigate([
      '/register'
    ]);

  }


  // =====================================================
  // ACTIVATE / DEACTIVATE STUDENT
  // =====================================================

  toggleStudentStatus(
    student: Student
  ): void {

    if (!student) {

      return;

    }


    const newStatus =
      !student.isActive;


    console.log(
      'Updating student status:',
      {
        studentId: student.id,
        currentStatus: student.isActive,
        newStatus: newStatus
      }
    );


    this.studentService
      .updateStudentStatus(
        student.id,
        newStatus
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Student status updated:',
            response
          );


          // Reload from database
          this.loadStudents();

        },


        error: (error) => {

          console.error(
            'Failed to update student status:',
            error
          );


          this.errorMessage.set(
            error.error?.message ||
            'Unable to update student status.'
          );

        }

      });

  }

}