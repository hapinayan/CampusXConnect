import { Component, OnInit } from '@angular/core';
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
  // STUDENT DATA
  // =========================

  students: Student[] = [];

  isLoading = false;

  errorMessage = '';


  // =========================
  // COUNTS
  // =========================

  totalStudents = 0;

  activeStudents = 0;

  inactiveStudents = 0;


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private studentService: StudentService
  ) {}


  // =========================
  // PAGE LOAD
  // =========================

  ngOnInit(): void {
    this.loadStudents();
  }


  // =========================
  // LOAD ALL STUDENTS
  // =========================

  loadStudents(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.studentService.getStudents().subscribe({

      next: (students) => {

        this.students = students;

        this.totalStudents =
          students.length;

        this.activeStudents =
          students.filter(student =>
            student.isActive === true
          ).length;

        this.inactiveStudents =
          students.filter(student =>
            student.isActive === false
          ).length;

        this.isLoading = false;

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

        this.errorMessage =
          'Unable to load students.';

        this.isLoading = false;
      }
    });
  }
}