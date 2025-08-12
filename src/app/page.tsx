'use client';

import { useState, useEffect } from 'react';
import { Psychologist, Specialty, ModalityFilter } from '@/types';
import PsychologistCard from '@/components/PsychologistCard';
import BookingModal from '@/components/BookingModal';
import MySessions from '@/components/MySessions';
import SessionStats from '@/components/SessionStats';
import SessionManager from '@/components/SessionManager';
import { useSessions } from '@/hooks/useSessions';

export default function Home() {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedModality, setSelectedModality] = useState<ModalityFilter>('all');
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'psychologists' | 'sessions' | 'manager'>('psychologists');

  // Usar el nuevo hook de sesiones
  const { addSession, hasSessions } = useSessions();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch specialties
      const specialtiesResponse = await fetch('/api/specialties');
      const specialtiesData = await specialtiesResponse.json();
      setSpecialties(specialtiesData);

      // Fetch psychologists
      const psychologistsResponse = await fetch('/api/psychologists');
      const psychologistsData = await psychologistsResponse.json();
      setPsychologists(psychologistsData);
    } catch (error) {
      setError('Error al cargar los datos');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialtyFilter = async (specialtyId: string) => {
    setSelectedSpecialty(specialtyId);
    await applyFilters(specialtyId, selectedModality);
  };

  const handleModalityFilter = async (modality: ModalityFilter) => {
    setSelectedModality(modality);
    await applyFilters(selectedSpecialty, modality);
  };

  const applyFilters = async (specialtyId: string, modality: ModalityFilter) => {
    try {
      const params = new URLSearchParams();
      if (specialtyId) params.append('specialty', specialtyId);
      if (modality && modality !== 'all') params.append('modality', modality);
      
      const url = `/api/psychologists${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      setPsychologists(data);
    } catch (error) {
      setError('Error al filtrar psicólogos');
      console.error('Error filtering psychologists:', error);
    }
  };

  const handleBookSession = (psychologistId: string) => {
    const psychologist = psychologists.find(p => p.id === psychologistId);
    if (psychologist) {
      setSelectedPsychologist(psychologist);
      setIsModalOpen(true);
    }
  };

  const handleBookingSubmit = async (bookingData: {
    psychologistId: string;
    patientName: string;
    date: string;
    startTime: string;
    endTime: string;
    specialty: string;
    modality: 'online' | 'inPerson' | '';
  }) => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agendar la sesión');
      }

      const session = await response.json();
      
      // Guardar en localStorage usando el nuevo hook
      addSession(session);
      
      alert('¡Sesión agendada exitosamente!');
      
      // Cambiar a la pestaña de sesiones
      setActiveTab('sessions');
      
      // Refresh psychologists to update availability
      fetchData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Gestión de Sesiones Psicológicas
          </h1>
          <p className="text-gray-600">
            Encuentra y agenda sesiones con psicólogos especializados
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('psychologists')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'psychologists'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Psicólogos ({psychologists.length})
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'sessions'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Mis Sesiones
            </button>
            {hasSessions() && (
              <button
                onClick={() => setActiveTab('manager')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'manager'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Gestión Avanzada
              </button>
            )}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'psychologists' ? (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Filtros
              </h2>
              
              {/* Filtro por especialidad */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Especialidad:</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSpecialtyFilter('')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedSpecialty === ''
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Todas
                  </button>
                  {specialties.map((specialty) => (
                    <button
                      key={specialty.id}
                      onClick={() => handleSpecialtyFilter(specialty.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedSpecialty === specialty.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {specialty.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro por modalidad */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Modalidad:</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleModalityFilter('all')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedModality === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => handleModalityFilter('online')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedModality === 'online'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🌐 Solo Online
                  </button>
                  <button
                    onClick={() => handleModalityFilter('inPerson')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedModality === 'inPerson'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🏢 Solo Presencial
                  </button>
                  <button
                    onClick={() => handleModalityFilter('both')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedModality === 'both'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🔄 Ambas Modalidades
                  </button>
                </div>
              </div>
            </div>

            {/* Psychologists List */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Psicólogos Disponibles ({psychologists.length})
              </h2>
              
              {psychologists.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No se encontraron psicólogos con los filtros aplicados
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {psychologists.map((psychologist) => (
                    <PsychologistCard
                      key={psychologist.id}
                      psychologist={psychologist}
                      onBookSession={handleBookSession}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'sessions' ? (
          <>
            {/* Statistics */}
            <SessionStats specialties={specialties} />
            
            {/* My Sessions */}
            <MySessions 
              psychologists={psychologists}
              specialties={specialties}
            />
          </>
        ) : (
          <SessionManager 
            psychologists={psychologists}
            specialties={specialties}
          />
        )}

        {/* Booking Modal */}
        <BookingModal
          psychologist={selectedPsychologist}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPsychologist(null);
          }}
          onBook={handleBookingSubmit}
        />
      </div>
    </div>
  );
}
