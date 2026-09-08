export interface Hostel {
  id: number;
  name: string;
  location: string;
  rooms: Room[];
}

export interface Room {
  id: number;
  roomNumber: string;
  capacity: number;
}

export interface HostelApplication {
  id: number;
  studentId: number;
  hostelId: number;
  status: string;
  preferences?: string;
  roomId?: number | null;
}