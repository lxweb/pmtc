import { NextResponse } from 'next/server';
import { specialties } from '@/data/mockData';

export async function GET() {
  return NextResponse.json(specialties);
}
