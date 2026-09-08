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

  private readonly authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // =========================
  // LOGIN
  // =========================
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.authUrl}/login`,
      data
    );
  }

  // =========================
  // REGISTER
  // =========================
  register(data: RegisterRequest): Observable<any> {
    return this.http.post<any>(
      `${this.authUrl}/register`,
      data
    );
  }

  // =========================
  // SAVE JWT TOKEN
  // =========================
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // =========================
  // GET JWT TOKEN
  // =========================
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // =========================
  // CHECK LOGIN STATUS
  // =========================
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // =========================
  // GET CURRENT STUDENT
  // =========================
  getCurrentStudent(): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(
      `${this.authUrl}/me`
    );
  }

  // =========================
  // LOGOUT
  // =========================
  logout(): void {
    localStorage.removeItem('token');
  }
}