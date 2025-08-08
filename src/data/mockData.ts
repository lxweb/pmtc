import { Psychologist, Specialty, Session } from '@/types';

export const specialties: Specialty[] = [
  { id: '1', name: 'Fobias', description: 'Tratamiento de fobias específicas' },
  { id: '2', name: 'Relaciones personales', description: 'Terapia de pareja y relaciones' },
  { id: '3', name: 'Depresión', description: 'Tratamiento de depresión y ansiedad' },
  { id: '4', name: 'Estrés laboral', description: 'Manejo del estrés en el trabajo' },
  { id: '5', name: 'Autoestima', description: 'Desarrollo de la autoestima' },
];

export const psychologists: Psychologist[] = [
  {
    id: '1',
    name: 'Dra. María González',
    specialties: ['1', '3', '5'],
    timezone: 'America/Argentina/Buenos_Aires',
    availability: [
      { id: '1', day: 'monday', startTime: '09:00', endTime: '10:00', isAvailable: true },
      { id: '2', day: 'monday', startTime: '10:00', endTime: '11:00', isAvailable: true },
      { id: '3', day: 'tuesday', startTime: '14:00', endTime: '15:00', isAvailable: true },
      { id: '4', day: 'wednesday', startTime: '16:00', endTime: '17:00', isAvailable: true },
      { id: '5', day: 'thursday', startTime: '11:00', endTime: '12:00', isAvailable: true },
    ]
  },
  {
    id: '2',
    name: 'Dr. Carlos Rodríguez',
    specialties: ['2', '4'],
    timezone: 'America/Argentina/Buenos_Aires',
    availability: [
      { id: '6', day: 'monday', startTime: '15:00', endTime: '16:00', isAvailable: true },
      { id: '7', day: 'tuesday', startTime: '09:00', endTime: '10:00', isAvailable: true },
      { id: '8', day: 'wednesday', startTime: '17:00', endTime: '18:00', isAvailable: true },
      { id: '9', day: 'friday', startTime: '10:00', endTime: '11:00', isAvailable: true },
    ]
  },
  {
    id: '3',
    name: 'Lic. Ana Martínez',
    specialties: ['1', '2', '3', '4'],
    timezone: 'America/Argentina/Buenos_Aires',
    availability: [
      { id: '10', day: 'monday', startTime: '18:00', endTime: '19:00', isAvailable: true },
      { id: '11', day: 'tuesday', startTime: '16:00', endTime: '17:00', isAvailable: true },
      { id: '12', day: 'thursday', startTime: '14:00', endTime: '15:00', isAvailable: true },
      { id: '13', day: 'friday', startTime: '15:00', endTime: '16:00', isAvailable: true },
    ]
  },
];

export const sessions: Session[] = [
  {
    id: '1',
    psychologistId: '1',
    patientName: 'Juan Pérez',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '10:00',
    specialty: '1',
    status: 'scheduled'
  },
  {
    id: '2',
    psychologistId: '2',
    patientName: 'María López',
    date: '2024-01-16',
    startTime: '15:00',
    endTime: '16:00',
    specialty: '2',
    status: 'scheduled'
  },
  {
    id: '3',
    psychologistId: '3',
    patientName: 'Carlos García',
    date: '2024-01-17',
    startTime: '18:00',
    endTime: '19:00',
    specialty: '3',
    status: 'scheduled'
  },
];
