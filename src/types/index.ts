export interface Psychologist {
  id: string;
  name: string;
  specialties: (string | Specialty)[];
  modalities: {
    online: boolean;
    inPerson: boolean;
  };
  availability: {
    online: TimeSlot[];
    inPerson: TimeSlot[];
  };
  timezone: string;
}

export interface TimeSlot {
  id: string;
  day: string; // 'monday', 'tuesday', etc.
  startTime: string; // '09:00'
  endTime: string; // '10:00'
  isAvailable: boolean;
  modality: 'online' | 'inPerson';
}

export interface Session {
  id: string;
  psychologistId: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  specialty: string;
  modality: 'online' | 'inPerson';
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
  modality: 'online' | 'inPerson';
}

// Nuevos tipos para filtrado
export type ModalityFilter = 'online' | 'inPerson' | 'both' | 'all';

// Tipo helper para especialidades
export type SpecialtyInput = string | Specialty;
