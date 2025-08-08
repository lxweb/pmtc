'use client';

import { Specialty } from '@/types';
import { useSessions } from '@/hooks/useSessions';

interface SessionStatsProps {
  specialties: Specialty[];
}

export default function SessionStats({ specialties }: SessionStatsProps) {
  const { sessions } = useSessions();

  const getSpecialtyName = (specialtyId: string) => {
    const specialty = specialties.find(s => s.id === specialtyId);
    return specialty?.name || 'Especialidad no encontrada';
  };

  const getMostConsultedSpecialty = () => {
    const specialtyCounts = sessions.reduce((acc, session) => {
      const specialtyName = getSpecialtyName(session.specialty);
      acc[specialtyName] = (acc[specialtyName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostConsulted = Object.entries(specialtyCounts).sort((a, b) => b[1] - a[1])[0];
    return mostConsulted ? { name: mostConsulted[0], count: mostConsulted[1] } : null;
  };

  const getMostBookedDay = () => {
    const dayCounts = sessions.reduce((acc, session) => {
      const day = new Date(session.date).toLocaleDateString('es-ES', { weekday: 'long' });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostBooked = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];
    return mostBooked ? { day: mostBooked[0], count: mostBooked[1] } : null;
  };

  const getMostUsedModality = () => {
    // En este caso, todas las sesiones son online
    const onlineCount = sessions.length;
    return { modality: 'Online', count: onlineCount };
  };

  if (sessions.length === 0) {
    return null;
  }

  const mostConsulted = getMostConsultedSpecialty();
  const mostBooked = getMostBookedDay();
  const mostUsed = getMostUsedModality();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Estadísticas de Mis Sesiones
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Especialidad más consultada */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            Especialidad más consultada
          </h3>
          {mostConsulted ? (
            <div>
              <p className="text-2xl font-bold text-blue-600">{mostConsulted.name}</p>
              <p className="text-sm text-blue-600">{mostConsulted.count} sesiones</p>
            </div>
          ) : (
            <p className="text-gray-500">No hay datos suficientes</p>
          )}
        </div>

        {/* Día con más sesiones */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-green-800 mb-2">
            Día con más sesiones
          </h3>
          {mostBooked ? (
            <div>
              <p className="text-2xl font-bold text-green-600">{mostBooked.day}</p>
              <p className="text-sm text-green-600">{mostBooked.count} sesiones</p>
            </div>
          ) : (
            <p className="text-gray-500">No hay datos suficientes</p>
          )}
        </div>

        {/* Modalidad más usada */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-purple-800 mb-2">
            Modalidad más usada
          </h3>
          <div>
            <p className="text-2xl font-bold text-purple-600">{mostUsed.modality}</p>
            <p className="text-sm text-purple-600">{mostUsed.count} sesiones</p>
          </div>
        </div>
      </div>

      {/* Resumen general */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-800">{sessions.length}</p>
            <p className="text-sm text-gray-600">Total sesiones</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {sessions.filter(s => s.status === 'scheduled').length}
            </p>
            <p className="text-sm text-gray-600">Agendadas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">
              {sessions.filter(s => s.status === 'cancelled').length}
            </p>
            <p className="text-sm text-gray-600">Canceladas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {new Set(sessions.map(s => s.psychologistId)).size}
            </p>
            <p className="text-sm text-gray-600">Psicólogos diferentes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
