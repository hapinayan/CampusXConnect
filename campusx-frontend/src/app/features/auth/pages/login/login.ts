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


    this.loading = true;


    // ===================================================
    // LOGIN API
    // ===================================================

    this.authService
      .login(this.loginData)
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (response) => {

          console.log(
            'Login successful:',
            response
          );


          // =============================================
          // SAVE TOKEN
          // =============================================

          if (response.token) {

            this.authService.saveToken(
              response.token
            );

          }


          // =============================================
          // GET ROLE FROM JWT TOKEN
          // =============================================

          const role =
            this.getRoleFromToken(
              response.token
            );


          console.log(
            'Logged in role:',
            role
          );


          // =============================================
          // ADMIN LOGIN
          // =============================================

          if (
            role?.toLowerCase() === 'admin'
          ) {

            this.loading = false;

            this.successMessage =
              'Admin login successful!';


            setTimeout(() => {

              this.router.navigate([
                '/admin/labs'
              ]);

            }, 500);


            return;

          }


          // =============================================
          // STUDENT LOGIN
          // =============================================

          this.authService
            .getCurrentStudent()
            .subscribe({

              next: (student) => {

                console.log(
                  'Current student:',
                  student
                );


                // =======================================
                // SAVE STUDENT
                // =======================================

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


                // =======================================
                // GO DASHBOARD
                // =======================================

                setTimeout(() => {

                  this.router.navigate([
                    '/dashboard'
                  ]);

                }, 500);

              },


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
  // GET ROLE FROM JWT
  // =====================================================

  private getRoleFromToken(
    token: string | undefined
  ): string | null {

    if (!token) {

      return null;

    }


    try {

      const payload =
        token.split('.')[1];


      const decodedPayload =
        JSON.parse(
          atob(
            payload
              .replace(/-/g, '+')
              .replace(/_/g, '/')
          )
        );


      return (
        decodedPayload.role ||
        decodedPayload[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] ||
        null
      );

    }
    catch (error) {

      console.error(
        'Unable to decode JWT token:',
        error
      );


      return null;

    }

  }

}