import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';

import {
  StudentService,
  Student
} from '../../../../core/services/student';

import {
  HostelService
} from '../../../../core/services/hostel.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  totalStudents = signal(0);

  totalHostelApplications = signal(0);

  constructor(
    private studentService: StudentService,
    private hostelService: HostelService
  ) {}

  ngOnInit(): void {
    this.loadStudentCount();
    this.loadHostelApplicationCount();
  }

  // =========================
  // STUDENT COUNT
  // =========================

  loadStudentCount(): void {
    this.studentService.getStudents().subscribe({
      next: (students: Student[]) => {
        this.totalStudents.set(
          Array.isArray(students) ? students.length : 0
        );

        console.log(
          'Dashboard student count:',
          this.totalStudents()
        );
      },

      error: (error) => {
        console.error(
          'Failed to load student count:',
          error
        );

        this.totalStudents.set(0);
      }
    });
  }

  // =========================
  // HOSTEL APPLICATION COUNT
  // =========================

  loadHostelApplicationCount(): void {
    this.hostelService
      .getAdminHostelApplications()
      .subscribe({
        next: (applications) => {
          this.totalHostelApplications.set(
            Array.isArray(applications)
              ? applications.length
              : 0
          );

          console.log(
            'Dashboard hostel application count:',
            this.totalHostelApplications()
          );
        },

        error: (error) => {
          console.error(
            'Failed to load hostel application count:',
            error
          );

          this.totalHostelApplications.set(0);
        }
      });
  }

}