import { NextRequest, NextResponse } from 'next/server';
import { sessions, psychologists } from '@/data/mockData';
import { BookingRequest } from '@/types';

export async function GET() {
  return NextResponse.json(sessions);
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json();
    
    // Validaciones básicas
    if (!body.psychologistId || !body.patientName || !body.date || !body.startTime || !body.endTime || !body.specialty) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el psicólogo existe
    const psychologist = psychologists.find(p => p.id === body.psychologistId);
    if (!psychologist) {
      return NextResponse.json(
        { error: 'Psicólogo no encontrado' },
        { status: 404 }
      );
    }

    // Verificar disponibilidad (simplificado)
    const dayOfWeek = new Date(body.date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const isAvailable = psychologist.availability.some(slot => 
      slot.day === dayOfWeek && 
      slot.startTime === body.startTime && 
      slot.isAvailable
    );

    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Horario no disponible' },
        { status: 409 }
      );
    }

    // Crear nueva sesión
    const newSession = {
      id: (sessions.length + 1).toString(),
      psychologistId: body.psychologistId,
      patientName: body.patientName,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      specialty: body.specialty,
      status: 'scheduled' as const
    };

    // En un caso real, aquí guardaríamos en la base de datos
    sessions.push(newSession);

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
