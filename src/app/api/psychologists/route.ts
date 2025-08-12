import { NextRequest, NextResponse } from 'next/server';
import { psychologists, specialties } from '@/data/mockData';
import { ModalityFilter } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const specialtyFilter = searchParams.get('specialty');
  const modalityFilter = searchParams.get('modality') as ModalityFilter;

  let filteredPsychologists = psychologists;

  // Filtrar por especialidad si se proporciona
  if (specialtyFilter) {
    filteredPsychologists = filteredPsychologists.filter(psychologist =>
      psychologist.specialties.includes(specialtyFilter)
    );
  }

  // Filtrar por modalidad si se proporciona
  if (modalityFilter && modalityFilter !== 'all') {
    filteredPsychologists = filteredPsychologists.filter(psychologist => {
      switch (modalityFilter) {
        case 'online':
          return psychologist.modalities.online;
        case 'inPerson':
          return psychologist.modalities.inPerson;
        case 'both':
          return psychologist.modalities.online && psychologist.modalities.inPerson;
        default:
          return true;
      }
    });
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
