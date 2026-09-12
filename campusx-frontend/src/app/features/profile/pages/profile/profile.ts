import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { StudentProfile } from '../../../../core/models/auth';

@Component({
  selector: 'app-profile',
  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  student: StudentProfile | null = null;


  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================
  // INITIAL LOAD
  // =========================

  ngOnInit(): void {

    this.loadStudentProfile();

  }


  // =========================
  // LOAD PROFILE
  // =========================

  loadStudentProfile(): void {

    console.log('Loading student profile...');

    this.authService.getCurrentStudent().subscribe({

      next: (data: StudentProfile) => {

        console.log(
          'Profile data received:',
          data
        );

        this.student = data;

        this.cdr.detectChanges();

      },


      error: (error) => {

        console.error(
          'Failed to load profile:',
          error
        );


        // Unauthorized
        if (error.status === 401) {

          this.authService.logout();

          this.router.navigate([
            '/login'
          ]);

        }

      }

    });

  }


  // =========================
  // GO TO DASHBOARD
  // =========================

  goToDashboard(): void {

    this.router.navigate([
      '/dashboard'
    ]);

  }


  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}