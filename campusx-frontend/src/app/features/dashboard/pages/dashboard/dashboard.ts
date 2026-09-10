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

import {
  StudentProfile
} from '../../../../core/models/auth';


@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {


  // =====================================================
  // STUDENT PROFILE
  // =====================================================

  student: StudentProfile | null = null;



  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}



  // =====================================================
  // INITIAL LOAD
  // =====================================================

  ngOnInit(): void {

    console.log(
      'Dashboard initialized'
    );


    this.loadStudentProfile();

  }



  // =====================================================
  // LOAD STUDENT PROFILE
  // =====================================================

  loadStudentProfile(): void {

    console.log(
      'Loading student profile...'
    );


    this.authService
      .getCurrentStudent()
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (data: StudentProfile) => {

          console.log(
            'Student profile received:',
            data
          );


          this.student = data;


          // Update dashboard UI

          this.cdr.detectChanges();

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error) => {

          console.error(
            'Failed to load student profile:',
            error
          );


          // ---------------------------------------------
          // UNAUTHORIZED
          // ---------------------------------------------

          if (
            error.status === 401
          ) {

            console.warn(
              'Session expired. Redirecting to login...'
            );


            this.authService.logout();


            this.router.navigate([
              '/login'
            ]);

          }

        }

      });

  }



  // =====================================================
  // GO TO PROFILE
  // =====================================================

  goToProfile(): void {

    console.log(
      'Opening student profile...'
    );


    this.router.navigate([
      '/profile'
    ]);

  }



  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    console.log(
      'Student logging out...'
    );


    this.authService.logout();


    this.router.navigate([
      '/login'
    ]);

  }

}