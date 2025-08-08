'use client';

import { useState } from 'react';
import { Psychologist, Specialty } from '@/types';

interface BookingModalProps {
  psychologist: Psychologist | null;
  specialties: Specialty[];
  isOpen: boolean;
  onClose: () => void;
  onBook: (bookingData: any) => void;
}

export default function BookingModal({ 
  psychologist, 
  specialties, 
  isOpen, 
  onClose, 
  onBook 
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    date: '',
    startTime: '',
    specialty: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !psychologist) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingData = {
        psychologistId: psychologist.id,
        patientName: formData.patientName,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.startTime, // Simplificado: misma hora + 1 hora
        specialty: formData.specialty
      };

      await onBook(bookingData);
      
      // Reset form
      setFormData({
        patientName: '',
        date: '',
        startTime: '',
        specialty: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error booking session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableTimeSlots = () => {
    return psychologist.availability
      .filter(slot => slot.isAvailable)
      .map(slot => slot.startTime)
      .filter((time, index, arr) => arr.indexOf(time) === index); // Remove duplicates
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horario
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
          </div>

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
              {psychologist.specialties.map((specialty: any) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
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
              disabled={isSubmitting}
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
