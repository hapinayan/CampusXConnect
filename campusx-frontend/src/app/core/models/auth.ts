export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  indexNumber: string;
  fullName: string;
  email: string;
  faculty: string;
  contactNumber: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message?: string;
}

export interface StudentProfile {
  id: number;
  userId: number;
  indexNumber: string;
  fullName: string;
  email: string;
  faculty: string;
  contactNumber: string;
}