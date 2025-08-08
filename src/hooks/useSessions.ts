import { useLocalStorage } from './useLocalStorage';
import { Session } from '@/types';

export function useSessions() {
  const [sessions, setSessions, { clearValue, hasValue }] = useLocalStorage<Session[]>('my-sessions', []);

  // Agregar una nueva sesión
  const addSession = (session: Session) => {
    setSessions(prevSessions => [...prevSessions, session]);
  };

  // Actualizar una sesión existente
  const updateSession = (sessionId: string, updates: Partial<Session>) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId ? { ...session, ...updates } : session
      )
    );
  };

  // Cancelar una sesión
  const cancelSession = (sessionId: string) => {
    updateSession(sessionId, { status: 'cancelled' });
  };

  // Completar una sesión
  const completeSession = (sessionId: string) => {
    updateSession(sessionId, { status: 'completed' });
  };

  // Eliminar una sesión completamente
  const deleteSession = (sessionId: string) => {
    setSessions(prevSessions =>
      prevSessions.filter(session => session.id !== sessionId)
    );
  };

  // Obtener sesiones por estado
  const getSessionsByStatus = (status: Session['status']) => {
    return sessions.filter(session => session.status === status);
  };

  // Obtener sesiones por psicólogo
  const getSessionsByPsychologist = (psychologistId: string) => {
    return sessions.filter(session => session.psychologistId === psychologistId);
  };

  // Obtener sesiones por especialidad
  const getSessionsBySpecialty = (specialtyId: string) => {
    return sessions.filter(session => session.specialty === specialtyId);
  };

  // Obtener sesiones por fecha
  const getSessionsByDate = (date: string) => {
    return sessions.filter(session => session.date === date);
  };

  // Obtener sesiones futuras
  const getUpcomingSessions = () => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter(session => 
      session.date >= today && session.status === 'scheduled'
    );
  };

  // Obtener sesiones pasadas
  const getPastSessions = () => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter(session => session.date < today);
  };

  // Limpiar todas las sesiones
  const clearAllSessions = () => {
    clearValue();
  };

  // Verificar si hay sesiones
  const hasSessions = () => {
    return sessions.length > 0;
  };

  // Obtener estadísticas básicas
  const getStats = () => {
    const total = sessions.length;
    const scheduled = getSessionsByStatus('scheduled').length;
    const completed = getSessionsByStatus('completed').length;
    const cancelled = getSessionsByStatus('cancelled').length;

    return {
      total,
      scheduled,
      completed,
      cancelled,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      cancellationRate: total > 0 ? (cancelled / total) * 100 : 0
    };
  };

  // Exportar sesiones como JSON
  const exportSessions = () => {
    const dataStr = JSON.stringify(sessions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sessions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Importar sesiones desde JSON
  const importSessions = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSessions = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedSessions)) {
            setSessions(importedSessions);
            resolve();
          } else {
            reject(new Error('Formato de archivo inválido'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsText(file);
    });
  };

  return {
    sessions,
    addSession,
    updateSession,
    cancelSession,
    completeSession,
    deleteSession,
    getSessionsByStatus,
    getSessionsByPsychologist,
    getSessionsBySpecialty,
    getSessionsByDate,
    getUpcomingSessions,
    getPastSessions,
    clearAllSessions,
    hasSessions,
    getStats,
    exportSessions,
    importSessions,
    hasValue
  };
}
