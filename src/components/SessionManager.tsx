'use client';

import { useState } from 'react';
import { Psychologist, Specialty } from '@/types';
import { useSessions } from '@/hooks/useSessions';

interface SessionManagerProps {
  psychologists: Psychologist[];
  specialties: Specialty[];
}

export default function SessionManager({ psychologists, specialties }: SessionManagerProps) {
  const {
    sessions,
    addSession,
    cancelSession,
    completeSession,
    deleteSession,
    getUpcomingSessions,
    getPastSessions,
    clearAllSessions,
    getStats,
    exportSessions,
    importSessions,
    hasSessions
  } = useSessions();

  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

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

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImportError(null);
      await importSessions(file);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (error: any) {
      setImportError(error.message);
    }
  };

  const handleExport = () => {
    exportSessions();
  };

  const handleClearAll = () => {
    if (confirm('¿Estás seguro de que quieres eliminar todas las sesiones? Esta acción no se puede deshacer.')) {
      clearAllSessions();
    }
  };

  const stats = getStats();
  const upcomingSessions = getUpcomingSessions();
  const pastSessions = getPastSessions();

  if (!hasSessions()) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Gestión de Sesiones
        </h2>
        <p className="text-gray-500 text-center py-8">
          No tienes sesiones agendadas. ¡Agenda tu primera sesión!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Estadísticas de Sesiones
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{stats.scheduled}</p>
            <p className="text-sm text-gray-600">Agendadas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completadas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            <p className="text-sm text-gray-600">Canceladas</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-lg font-semibold text-green-600">
              {stats.completionRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Tasa de completitud</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-red-600">
              {stats.cancellationRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Tasa de cancelación</p>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Acciones
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Exportar Sesiones
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Importar Sesiones
          </button>
          <button
            onClick={handleClearAll}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Limpiar Todas
          </button>
        </div>
      </div>

      {/* Sesiones Futuras */}
      {upcomingSessions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Sesiones Futuras ({upcomingSessions.length})
          </h3>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => completeSession(session.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Completar
                    </button>
                    <button
                      onClick={() => cancelSession(session.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sesiones Pasadas */}
      {pastSessions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Historial de Sesiones ({pastSessions.length})
          </h3>
          <div className="space-y-4">
            {pastSessions.map((session) => (
              <div
                key={session.id}
                className={`border rounded-lg p-4 ${
                  session.status === 'completed'
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 opacity-75'
                }`}
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
                    <span className={`inline-block text-xs px-2 py-1 rounded mt-2 ${
                      session.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {session.status === 'completed' ? 'Completada' : 'Cancelada'}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Importación */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Importar Sesiones
            </h3>
            
            {importError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {importError}
              </div>
            )}
            
            {importSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Sesiones importadas exitosamente
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar archivo JSON
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
