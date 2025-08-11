import { NextRequest } from 'next/server'
import { GET, POST } from '../sessions/route'

// Mock the data module
const mockSessions = [
  {
    id: '1',
    psychologistId: '1',
    patientName: 'Juan Pérez',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '10:00',
    specialty: '1',
    status: 'scheduled' as const
  }
]

const mockPsychologists = [
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
      },
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
]

jest.mock('@/data/mockData', () => ({
  sessions: mockSessions,
  psychologists: mockPsychologists
}))

describe('GET /api/sessions', () => {
  it('returns all sessions', async () => {
    const request = new NextRequest('http://localhost:3000/api/sessions')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0]).toEqual(mockSessions[0])
  })

  it('returns empty array when no sessions exist', async () => {
    jest.doMock('@/data/mockData', () => ({
      sessions: [],
      psychologists: mockPsychologists
    }))

    const request = new NextRequest('http://localhost:3000/api/sessions')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(0)
  })
})

describe('POST /api/sessions', () => {
  beforeEach(() => {
    // Reset mock data
    jest.doMock('@/data/mockData', () => ({
      sessions: [...mockSessions],
      psychologists: [...mockPsychologists]
    }))
  })

  it('creates a new session successfully', async () => {
    const bookingData = {
      psychologistId: '1',
      patientName: 'María García',
      date: '2024-01-15', // Monday
      startTime: '09:00',
      endTime: '10:00',
      specialty: '1'
    }

    const request = new NextRequest('http://localhost:3000/api/sessions', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data).toMatchObject({
      psychologistId: '1',
      patientName: 'María García',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '10:00',
      specialty: '1',
      status: 'scheduled'
    })
    expect(data.id).toBeDefined()
  })

  it('returns 400 when required fields are missing', async () => {
    const incompleteData = {
      psychologistId: '1',
      patientName: 'María García'
      // Missing date, startTime, endTime, specialty
    }

    const request = new NextRequest('http://localhost:3000/api/sessions', {
      method: 'POST',
      body: JSON.stringify(incompleteData)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Todos los campos son requeridos')
  })

  it('returns 404 when psychologist does not exist', async () => {
    const bookingData = {
      psychologistId: '999', // Non-existent psychologist
      patientName: 'María García',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '10:00',
      specialty: '1'
    }

    const request = new NextRequest('http://localhost:3000/api/sessions', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Psicólogo no encontrado')
  })

  it('returns 409 when time slot is not available', async () => {
    const bookingData = {
      psychologistId: '1',
      patientName: 'María García',
      date: '2024-01-15', // Monday
      startTime: '11:00', // Not available
      endTime: '12:00',
      specialty: '1'
    }

    const request = new NextRequest('http://localhost:3000/api/sessions', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data.error).toBe('Horario no disponible')
  })

  it('returns 409 when day is not available', async () => {
    const bookingData = {
      psychologistId: '1',
      patientName: 'María García',
      date: '2024-01-16', // Tuesday - available
      startTime: '14:00', // Available on Tuesday
      endTime: '15:00',
      specialty: '1'
    }

    const request = new NextRequest('http://localhost:3000/api/sessions', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201) // Should succeed for Tuesday 14:00
  })

  it('returns 500 when request body is invalid JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/sessions', {
      method: 'POST',
      body: 'invalid json'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error interno del servidor')
  })

  it('validates all required fields individually', async () => {
    const requiredFields = ['psychologistId', 'patientName', 'date', 'startTime', 'endTime', 'specialty']

    for (const field of requiredFields) {
      const incompleteData = {
        psychologistId: '1',
        patientName: 'María García',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '10:00',
        specialty: '1'
      }
      delete (incompleteData as any)[field]

      const request = new NextRequest('http://localhost:3000/api/sessions', {
        method: 'POST',
        body: JSON.stringify(incompleteData)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Todos los campos son requeridos')
    }
  })

  it('handles empty string values as missing fields', async () => {
    const bookingData = {
      psychologistId: '',
      patientName: 'María García',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '10:00',
      specialty: '1'
    }

    const request = new NextRequest('http://localhost:3000/api/sessions', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Todos los campos son requeridos')
  })
})
