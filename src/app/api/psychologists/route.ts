import { NextRequest, NextResponse } from 'next/server';
import { psychologists, specialties } from '@/data/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const specialtyFilter = searchParams.get('specialty');

  let filteredPsychologists = psychologists;

  // Filtrar por especialidad si se proporciona
  if (specialtyFilter) {
    filteredPsychologists = psychologists.filter(psychologist =>
      psychologist.specialties.includes(specialtyFilter)
    );
  }

  // Enriquecer con información de especialidades
  const enrichedPsychologists = filteredPsychologists.map(psychologist => ({
    ...psychologist,
    specialties: psychologist.specialties.map(specialtyId => 
      specialties.find(s => s.id === specialtyId)
    ).filter(Boolean)
  }));

  return NextResponse.json(enrichedPsychologists);
}
