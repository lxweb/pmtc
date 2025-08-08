'use client';

import { Session, Psychologist, Specialty } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface MySessionsProps {
  psychologists: Psychologist[];
  specialties: Specialty[];
}

export default function MySessions({ psychologists, specialties }: MySessionsProps) {
  const [mySessions, setMySessions] = useLocalStorage<Session[]>('my-sessions', []);

  const getPsychologistName = (psychologistId: string) => {
    const psychologist = psychologists.find(p => p.id === psychologistId);
    return psychologist?.name || 'Psicólogo no encontrado';
  };

  const getSpecialtyName = (specialtyId: string) => {
    const specialty = specialties.find(s => s.id === specialtyId);
    return specialty?.name || 'Especialidad no encontrada';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const cancelSession = (sessionId: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta sesión?')) {
      setMySessions(prevSessions => 
        prevSessions.map(session => 
          session.id === sessionId 
            ? { ...session, status: 'cancelled' as const }
            : session
        )
      );
    }
  };

  const activeSessions = mySessions.filter(session => session.status === 'scheduled');
  const cancelledSessions = mySessions.filter(session => session.status === 'cancelled');

  if (mySessions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Mis Sesiones
        </h2>
        <p className="text-gray-500 text-center py-8">
          No tienes sesiones agendadas. ¡Agenda tu primera sesión!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Mis Sesiones ({mySessions.length})
      </h2>

      {/* Sesiones Activas */}
      {activeSessions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Sesiones Agendadas ({activeSessions.length})
          </h3>
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="border border-green-200 bg-green-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {getPsychologistName(session.psychologistId)}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(session.date)} - {session.startTime} a {session.endTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      Especialidad: {getSpecialtyName(session.specialty)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Paciente: {session.patientName}
                    </p>
                  </div>
                  <button
                    onClick={() => cancelSession(session.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sesiones Canceladas */}
      {cancelledSessions.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Sesiones Canceladas ({cancelledSessions.length})
          </h3>
          <div className="space-y-4">
            {cancelledSessions.map((session) => (
              <div
                key={session.id}
                className="border border-gray-200 bg-gray-50 rounded-lg p-4 opacity-75"
              >
                <div>
                  <h4 className="font-semibold text-gray-600">
                    {getPsychologistName(session.psychologistId)}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(session.date)} - {session.startTime} a {session.endTime}
                  </p>
                  <p className="text-sm text-gray-500">
                    Especialidad: {getSpecialtyName(session.specialty)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Paciente: {session.patientName}
                  </p>
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-2">
                    Cancelada
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
