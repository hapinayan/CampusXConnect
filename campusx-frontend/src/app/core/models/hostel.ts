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
  hostelName: string;
  preferences: string;
  status: string;
  roomNumber: string | null;
  appliedAt: string;
  updatedAt: string | null;
}