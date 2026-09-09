import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  StudentProfile
} from '../models/auth';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authUrl =
    `${environment.apiUrl}/auth`;


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // LOGIN
  // =====================================================

  login(
    data: LoginRequest
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.authUrl}/login`,
      data
    );

  }


  // =====================================================
  // REGISTER
  // =====================================================

  register(
    data: RegisterRequest
  ): Observable<any> {

    return this.http.post<any>(
      `${this.authUrl}/register`,
      data
    );

  }


  // =====================================================
  // SAVE TOKEN
  // =====================================================

  saveToken(
    token: string
  ): void {

    localStorage.setItem(
      'token',
      token
    );

  }


  // =====================================================
  // GET TOKEN
  // =====================================================

  getToken(): string | null {

    return localStorage.getItem(
      'token'
    );

  }


  // =====================================================
  // CHECK LOGIN
  // =====================================================

  isLoggedIn(): boolean {

    return !!this.getToken();

  }


  // =====================================================
  // GET CURRENT STUDENT
  // =====================================================

  getCurrentStudent():
    Observable<StudentProfile> {

    return this.http.get<StudentProfile>(
      `${this.authUrl}/me`
    );

  }


  // =====================================================
  // SAVE CURRENT STUDENT
  // =====================================================

  saveStudent(
    student: StudentProfile
  ): void {

    localStorage.setItem(
      'studentId',
      student.id.toString()
    );

    localStorage.setItem(
      'student',
      JSON.stringify(student)
    );

  }


  // =====================================================
  // GET SAVED STUDENT
  // =====================================================

  getSavedStudent():
    StudentProfile | null {

    const student =
      localStorage.getItem('student');


    if (!student) {

      return null;

    }


    try {

      return JSON.parse(
        student
      ) as StudentProfile;

    }
    catch {

      return null;

    }

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'studentId'
    );

    localStorage.removeItem(
      'student'
    );

  }

}