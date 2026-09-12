// =====================================================
// EVENT
// =====================================================

export interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  venue: string;
  capacity: number;
  isActive: boolean;
}


// =====================================================
// CREATE EVENT
// =====================================================

export interface CreateEvent {
  title: string;
  description: string;
  eventDate: string;
  venue: string;
  capacity: number;
}


// =====================================================
// UPDATE EVENT
// =====================================================

export interface UpdateEvent {
  title: string;
  description: string;
  eventDate: string;
  venue: string;
  capacity: number;
  isActive: boolean;
}


// =====================================================
// EVENT REGISTRATION
// =====================================================

export interface EventRegistration {
  id: number;
  eventId: number;
  eventTitle?: string;
  studentId: number;
  registeredAt: string;
}


// =====================================================
// CREATE EVENT REGISTRATION
// =====================================================

export interface CreateEventRegistration {
  eventId: number;
}