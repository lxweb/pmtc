'use client';

import { useState, useEffect } from 'react';
import { Psychologist, Specialty } from '@/types';
import PsychologistCard from '@/components/PsychologistCard';
import BookingModal from '@/components/BookingModal';

export default function Home() {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    try {
      const url = specialtyId 
        ? `/api/psychologists?specialty=${specialtyId}`
        : '/api/psychologists';
      
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

  const handleBookingSubmit = async (bookingData: any) => {
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
      alert('¡Sesión agendada exitosamente!');
      
      // Refresh psychologists to update availability
      fetchData();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Filtrar por especialidad
          </h2>
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

        {/* Booking Modal */}
        <BookingModal
          psychologist={selectedPsychologist}
          specialties={specialties}
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
