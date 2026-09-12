import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { RegisterRequest } from '../../../../core/models/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerData: RegisterRequest = {
    indexNumber: '',
    fullName: '',
    email: '',
    faculty: '',
    contactNumber: '',
    password: ''
  };

  confirmPassword = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.registerData.indexNumber ||
      !this.registerData.fullName ||
      !this.registerData.email ||
      !this.registerData.faculty ||
      !this.registerData.contactNumber ||
      !this.registerData.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.authService.register(this.registerData).subscribe({

      next: (response) => {

        console.log('Registration successful:', response);

        this.loading = false;
        this.successMessage =
          'Registration successful! Redirecting to login...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },

      error: (error) => {

        console.error('Registration error:', error);

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Registration failed. Please try again.';
      }

    });
  }
}