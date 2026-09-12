import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../core/models/auth';


@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  // =====================================================
  // LOGIN DATA
  // =====================================================

  loginData: LoginRequest = {
    email: '',
    password: ''
  };


  loading = false;

  errorMessage = '';

  successMessage = '';


  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  // =====================================================
  // LOGIN
  // =====================================================

  login(): void {

    // Clear old messages
    this.errorMessage = '';
    this.successMessage = '';


    // ===================================================
    // VALIDATION
    // ===================================================

    if (
      !this.loginData.email ||
      !this.loginData.password
    ) {

      this.errorMessage =
        'Please enter email and password.';

      return;

    }


    // Start loading
    this.loading = true;


    // ===================================================
    // CALL LOGIN API
    // ===================================================

    this.authService
      .login(this.loginData)
      .subscribe({

        // ===============================================
        // LOGIN SUCCESS
        // ===============================================

        next: (response) => {

          console.log(
            'Login response:',
            response
          );


          // =============================================
          // CHECK TOKEN
          // =============================================

          if (!response.token) {

            this.loading = false;

            this.errorMessage =
              'Token was not received from server.';

            return;

          }


          // =============================================
          // SAVE TOKEN
          // =============================================

          this.authService.saveToken(
            response.token
          );


          // =============================================
          // GET ROLE DIRECTLY FROM BACKEND RESPONSE
          // =============================================

          const role =
            response.role?.trim();


          console.log(
            'Logged in role:',
            role
          );


          // =============================================
          // CHECK ROLE
          // =============================================

          if (!role) {

            this.loading = false;

            this.errorMessage =
              'User role was not received from server.';

            return;

          }


          // =============================================
          // SAVE ROLE
          // =============================================

          this.authService.saveRole(
            role
          );


          // =============================================
          // ADMIN LOGIN
          // =============================================

          if (
            role.toLowerCase() === 'admin'
          ) {

            this.loading = false;

            this.successMessage =
              'Admin login successful!';


            console.log(
              'Redirecting admin to labs...'
            );


            this.router.navigate([
              '/admin/labs'
            ]);


            return;

          }


          // =============================================
          // STUDENT LOGIN
          // =============================================

          if (
            role.toLowerCase() === 'student'
          ) {

            this.loadStudentProfile();

            return;

          }


          // =============================================
          // UNKNOWN ROLE
          // =============================================

          this.loading = false;

          this.errorMessage =
            'Unknown user role: ' + role;

        },


        // ===============================================
        // LOGIN ERROR
        // ===============================================

        error: (error) => {

          console.error(
            'Login error:',
            error
          );


          this.loading = false;


          this.errorMessage =
            error?.error?.message ||
            'Invalid email or password.';

        }

      });

  }


  // =====================================================
  // LOAD STUDENT PROFILE
  // =====================================================

  private loadStudentProfile(): void {

    this.authService
      .getCurrentStudent()
      .subscribe({

        // ===============================================
        // STUDENT PROFILE SUCCESS
        // ===============================================

        next: (student) => {

          console.log(
            'Current student:',
            student
          );


          // Save student
          this.authService.saveStudent(
            student
          );


          console.log(
            'Student ID saved:',
            student.id
          );


          this.loading = false;

          this.successMessage =
            'Login successful!';


          // Go to student dashboard
          this.router.navigate([
            '/dashboard'
          ]);

        },


        // ===============================================
        // STUDENT PROFILE ERROR
        // ===============================================

        error: (error) => {

          console.error(
            'Failed to get student profile:',
            error
          );


          this.loading = false;


          this.errorMessage =
            'Login successful, but student profile could not be loaded.';

        }

      });

  }

}