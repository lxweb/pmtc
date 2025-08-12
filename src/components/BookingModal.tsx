'use client';

import { useState } from 'react';
import { Psychologist, SpecialtyInput } from '@/types';

interface BookingModalProps {
  psychologist: Psychologist | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (bookingData: {
    psychologistId: string;
    patientName: string;
    date: string;
    startTime: string;
    endTime: string;
    specialty: string;
    modality: 'online' | 'inPerson' | '';
  }) => void;
}

export default function BookingModal({ 
  psychologist, 
  isOpen, 
  onClose, 
  onBook 
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    date: '',
    startTime: '',
    specialty: '',
    modality: '' as 'online' | 'inPerson' | ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !psychologist) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado una modalidad
    if (!formData.modality) {
      alert('Por favor selecciona una modalidad de sesión');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const bookingData = {
        psychologistId: psychologist.id,
        patientName: formData.patientName,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.startTime, // Simplificado: misma hora + 1 hora
        specialty: formData.specialty,
        modality: formData.modality
      };

      await onBook(bookingData);
      
      // Reset form
      setFormData({
        patientName: '',
        date: '',
        startTime: '',
        specialty: '',
        modality: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error booking session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableTimeSlots = () => {
    if (!formData.modality) return [];
    
    return psychologist.availability[formData.modality]
      .filter(slot => slot.isAvailable)
      .map(slot => slot.startTime)
      .filter((time, index, arr) => arr.indexOf(time) === index); // Remove duplicates
  };

  const getModalityLabel = (modality: 'online' | 'inPerson') => {
    return modality === 'online' ? 'Online' : 'Presencial';
  };

  const getModalityColor = (modality: 'online' | 'inPerson') => {
    return modality === 'online' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Agendar Sesión con {psychologist.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del paciente
            </label>
            <input
              type="text"
              required
              value={formData.patientName}
              onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Selección de modalidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modalidad de sesión
            </label>
            <div className="grid grid-cols-2 gap-2">
              {psychologist.modalities.online && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({...formData, modality: 'online', startTime: ''});
                  }}
                  className={`p-3 rounded-md border-2 transition-colors ${
                    formData.modality === 'online'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">🌐</div>
                    <div className="text-sm font-medium">Online</div>
                  </div>
                </button>
              )}
              {psychologist.modalities.inPerson && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({...formData, modality: 'inPerson', startTime: ''});
                  }}
                  className={`p-3 rounded-md border-2 transition-colors ${
                    formData.modality === 'inPerson'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏢</div>
                    <div className="text-sm font-medium">Presencial</div>
                  </div>
                </button>
              )}
            </div>
            {formData.modality && (
              <div className={`mt-2 px-3 py-2 rounded-md ${getModalityColor(formData.modality as 'online' | 'inPerson')}`}>
                <span className="text-sm font-medium">
                  Modalidad seleccionada: {getModalityLabel(formData.modality as 'online' | 'inPerson')}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Horarios disponibles solo si se seleccionó modalidad */}
          {formData.modality && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horario disponible para {getModalityLabel(formData.modality as 'online' | 'inPerson')}
              </label>
              <select
                required
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar horario</option>
                {getAvailableTimeSlots().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {getAvailableTimeSlots().length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No hay horarios disponibles para {getModalityLabel(formData.modality as 'online' | 'inPerson')}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialidad
            </label>
            <select
              required
              value={formData.specialty}
              onChange={(e) => setFormData({...formData, specialty: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar especialidad</option>
              {psychologist.specialties.map((specialty: SpecialtyInput, index: number) => {
                // Manejar tanto strings como objetos de especialidad
                const specialtyId = typeof specialty === 'string' ? specialty : specialty.id;
                const specialtyName = typeof specialty === 'string' ? specialty : specialty.name;
                
                return (
                  <option key={`${psychologist.id}-specialty-${specialtyId}-${index}`} value={specialtyId}>
                    {specialtyName}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.modality}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Agendando...' : 'Agendar Sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
