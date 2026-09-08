import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { StudentProfile } from '../../../../core/models/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

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

    this.authService.getCurrentStudent().subscribe({

      next: (data: StudentProfile) => {

        console.log('Student profile received:', data);

        this.student = data;

        // Update dashboard UI
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Failed to load student profile:',
          error
        );

        if (error.status === 401) {

          this.authService.logout();

          this.router.navigate(['/login']);
        }
      }

    });
  }

  goToProfile(): void {
  this.router.navigate(['/profile']);
}

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);
  }
}