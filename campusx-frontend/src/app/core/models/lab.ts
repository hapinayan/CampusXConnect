// =====================================================
// LAB
// =====================================================

export interface Lab {

  id: number;

  name: string;

  location: string;

  capacity: number;

  isActive: boolean;

}


// =====================================================
// AVAILABLE TIME SLOT
// =====================================================

export interface AvailableSlot {

  startTime: string;

  endTime: string;

  // Number of students already booked
  bookedCount?: number;

  // Maximum students allowed
  capacity?: number;

  // Whether this slot can still be booked
  isAvailable?: boolean;

}


// =====================================================
// LAB BOOKING
// =====================================================

export interface LabBooking {

  id: number;

  labId: number;

  labName?: string;

  studentId: number;

  bookingDate: string;

  startTime: string;

  endTime: string;

  createdAt: string;

}


// =====================================================
// CREATE LAB BOOKING
// =====================================================

export interface CreateLabBooking {

  labId: number;

  bookingDate: string;

  startTime: string;

  endTime: string;

}