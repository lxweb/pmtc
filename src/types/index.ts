export interface Psychologist {
  id: string;
  name: string;
  specialties: string[];
  availability: TimeSlot[];
  timezone: string;
}

export interface TimeSlot {
  id: string;
  day: string; // 'monday', 'tuesday', etc.
  startTime: string; // '09:00'
  endTime: string; // '10:00'
  isAvailable: boolean;
}

export interface Session {
  id: string;
  psychologistId: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  specialty: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
}

export interface BookingRequest {
  psychologistId: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  specialty: string;
}
