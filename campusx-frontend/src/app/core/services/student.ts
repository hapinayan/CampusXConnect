import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Student {
  id: number;
  userId: number;
  indexNumber: string;
  fullName: string;
  faculty: string;
  contactNumber: string;
  email?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private readonly apiUrl =
  `${environment.apiUrl}/admin/students`;

  constructor(private http: HttpClient) {}

  // GET ALL STUDENTS
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  // GET ONE STUDENT
  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(
      `${this.apiUrl}/${id}`
    );
  }

  // UPDATE STUDENT STATUS
updateStudentStatus(
  id: number,
  isActive: boolean
): Observable<any> {

  return this.http.put<any>(
    `${this.apiUrl}/${id}/status?isActive=${isActive}`,
    {}
  );
}

}