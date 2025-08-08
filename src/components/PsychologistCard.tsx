'use client';

import { Psychologist } from '@/types';
import { useState } from 'react';

interface PsychologistCardProps {
  psychologist: Psychologist;
  onBookSession: (psychologistId: string) => void;
}

export default function PsychologistCard({ psychologist, onBookSession }: PsychologistCardProps) {
  const [showAvailability, setShowAvailability] = useState(false);

  const getDayName = (day: string) => {
    const days: Record<string, string> = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };
    return days[day] || day;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {psychologist.name}
          </h3>
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Especialidades:</h4>
            <div className="flex flex-wrap gap-2">
              {psychologist.specialties.map((specialty: any) => (
                <span
                  key={specialty.id}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {specialty.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => onBookSession(psychologist.id)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Agendar Sesión
        </button>
      </div>

      <div className="border-t pt-4">
        <button
          onClick={() => setShowAvailability(!showAvailability)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          {showAvailability ? 'Ocultar' : 'Ver'} disponibilidad
          <svg
            className={`ml-1 w-4 h-4 transform transition-transform ${showAvailability ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAvailability && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            {psychologist.availability
              .filter(slot => slot.isAvailable)
              .map(slot => (
                <div
                  key={slot.id}
                  className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
                >
                  <span className="font-medium">{getDayName(slot.day)}</span>
                  <br />
                  <span>{slot.startTime} - {slot.endTime}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
