'use client';

import { Psychologist, SpecialtyInput } from '@/types';
import { useState } from 'react';

interface PsychologistCardProps {
  psychologist: Psychologist;
  onBookSession: (psychologistId: string) => void;
}

export default function PsychologistCard({ psychologist, onBookSession }: PsychologistCardProps) {
  const [showAvailability, setShowAvailability] = useState(false);
  const [selectedModality, setSelectedModality] = useState<'online' | 'inPerson' | null>(null);

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

  const getModalityLabel = (modality: 'online' | 'inPerson') => {
    return modality === 'online' ? 'Online' : 'Presencial';
  };

  const getModalityColor = (modality: 'online' | 'inPerson') => {
    return modality === 'online' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const getAvailableSlots = () => {
    if (!selectedModality) {
      // Mostrar todos los horarios disponibles
      return [
        ...psychologist.availability.online.filter(slot => slot.isAvailable),
        ...psychologist.availability.inPerson.filter(slot => slot.isAvailable)
      ];
    }
    
    return psychologist.availability[selectedModality]
      .filter(slot => slot.isAvailable);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {psychologist.name}
          </h3>
          
          {/* Modalidades disponibles */}
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Modalidades:</h4>
            <div className="flex flex-wrap gap-2">
              {psychologist.modalities.online && (
                <span className={`px-3 py-1 text-xs rounded-full border ${getModalityColor('online')}`}>
                  🌐 Online
                </span>
              )}
              {psychologist.modalities.inPerson && (
                <span className={`px-3 py-1 text-xs rounded-full border ${getModalityColor('inPerson')}`}>
                  🏢 Presencial
                </span>
              )}
            </div>
          </div>

          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Especialidades:</h4>
            <div className="flex flex-wrap gap-2">
              {psychologist.specialties.map((specialty: SpecialtyInput, index: number) => {
                // Manejar tanto strings como objetos de especialidad
                const specialtyId = typeof specialty === 'string' ? specialty : specialty.id;
                const specialtyName = typeof specialty === 'string' ? specialty : specialty.name;
                
                return (
                  <span
                    key={`${psychologist.id}-specialty-${specialtyId}-${index}`}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {specialtyName}
                  </span>
                );
              })}
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
        <div className="flex items-center justify-between mb-3">
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

          {/* Filtro de modalidad para horarios */}
          {showAvailability && (
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedModality(null)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  selectedModality === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Todas
              </button>
              {psychologist.modalities.online && (
                <button
                  onClick={() => setSelectedModality('online')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    selectedModality === 'online'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Solo Online
                </button>
              )}
              {psychologist.modalities.inPerson && (
                <button
                  onClick={() => setSelectedModality('inPerson')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    selectedModality === 'inPerson'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Solo Presencial
                </button>
              )}
            </div>
          )}
        </div>

        {showAvailability && (
          <div className="mt-3">
            {getAvailableSlots().length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No hay horarios disponibles para la modalidad seleccionada
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getAvailableSlots().map(slot => (
                  <div
                    key={`${slot.modality}-${slot.id}`}
                    className={`text-sm p-2 rounded border ${
                      slot.modality === 'online'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-purple-50 border-purple-200 text-purple-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{getDayName(slot.day)}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        slot.modality === 'online'
                          ? 'bg-green-200 text-green-700'
                          : 'bg-purple-200 text-purple-700'
                      }`}>
                        {getModalityLabel(slot.modality)}
                      </span>
                    </div>
                    <span className="block mt-1">{slot.startTime} - {slot.endTime}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
