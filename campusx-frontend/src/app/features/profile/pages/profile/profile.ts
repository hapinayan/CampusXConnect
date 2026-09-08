import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { StudentProfile } from '../../../../core/models/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
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

  ngOnInit(): void {
    this.loadStudentProfile();
  }

  loadStudentProfile(): void {

    console.log('Loading student profile...');

    this.authService.getCurrentStudent().subscribe({

      next: (data: StudentProfile) => {

        console.log('Profile data received:', data);

        this.student = data;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Failed to load profile:',
          error
        );

        if (error.status === 401) {

          this.authService.logout();

          this.router.navigate(['/login']);

        }

      }

    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);

  }
}