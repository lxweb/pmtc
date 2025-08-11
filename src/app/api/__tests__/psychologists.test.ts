import { NextRequest } from 'next/server'
import { GET } from '../psychologists/route'

// Mock the data module
jest.mock('@/data/mockData', () => ({
  psychologists: [
    {
      id: '1',
      name: 'Dr. María González',
      specialties: ['1', '2'],
      availability: [
        {
          id: '1',
          day: 'monday',
          startTime: '09:00',
          endTime: '10:00',
          isAvailable: true
        }
      ],
      timezone: 'America/Argentina/Buenos_Aires'
    },
    {
      id: '2',
      name: 'Dr. Juan Pérez',
      specialties: ['1'],
      availability: [
        {
          id: '2',
          day: 'tuesday',
          startTime: '14:00',
          endTime: '15:00',
          isAvailable: true
        }
      ],
      timezone: 'America/Argentina/Buenos_Aires'
    }
  ],
  specialties: [
    { id: '1', name: 'Depresión', description: 'Tratamiento de depresión' },
    { id: '2', name: 'Ansiedad', description: 'Manejo de ansiedad' }
  ]
}))

describe('GET /api/psychologists', () => {
  it('returns all psychologists when no specialty filter is provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/psychologists')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(2)
    expect(data[0].name).toBe('Dr. María González')
    expect(data[1].name).toBe('Dr. Juan Pérez')
  })

  it('filters psychologists by specialty when specialty parameter is provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/psychologists?specialty=1')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(2) // Both psychologists have specialty '1'
    expect(data[0].specialties).toContainEqual({ id: '1', name: 'Depresión', description: 'Tratamiento de depresión' })
    expect(data[1].specialties).toContainEqual({ id: '1', name: 'Depresión', description: 'Tratamiento de depresión' })
  })

  it('filters psychologists by specific specialty', async () => {
    const request = new NextRequest('http://localhost:3000/api/psychologists?specialty=2')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1) // Only Dr. María González has specialty '2'
    expect(data[0].name).toBe('Dr. María González')
    expect(data[0].specialties).toContainEqual({ id: '2', name: 'Ansiedad', description: 'Manejo de ansiedad' })
  })

  it('returns empty array when no psychologists match the specialty filter', async () => {
    const request = new NextRequest('http://localhost:3000/api/psychologists?specialty=999')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(0)
  })

  it('enriches psychologists with specialty information', async () => {
    const request = new NextRequest('http://localhost:3000/api/psychologists')
    const response = await GET(request)
    const data = await response.json()

    expect(data[0].specialties).toEqual([
      { id: '1', name: 'Depresión', description: 'Tratamiento de depresión' },
      { id: '2', name: 'Ansiedad', description: 'Manejo de ansiedad' }
    ])
  })

  it('filters out non-existent specialties', async () => {
    // Mock data with non-existent specialty
    const mockData = {
      psychologists: [
        {
          id: '1',
          name: 'Dr. María González',
          specialties: ['1', '999'], // 999 doesn't exist in specialties
          availability: [],
          timezone: 'America/Argentina/Buenos_Aires'
        }
      ],
      specialties: [
        { id: '1', name: 'Depresión', description: 'Tratamiento de depresión' }
      ]
    }

    jest.doMock('@/data/mockData', () => mockData)

    const request = new NextRequest('http://localhost:3000/api/psychologists')
    const response = await GET(request)
    const data = await response.json()

    expect(data[0].specialties).toHaveLength(1)
    expect(data[0].specialties[0].id).toBe('1')
  })

  it('handles URL with multiple query parameters', async () => {
    const request = new NextRequest('http://localhost:3000/api/psychologists?specialty=1&other=value')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(2)
  })

  it('handles URL without query parameters', async () => {
    const request = new NextRequest('http://localhost:3000/api/psychologists')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(2)
  })
})
