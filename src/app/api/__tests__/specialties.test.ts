import { NextRequest } from 'next/server'
import { GET } from '../specialties/route'

// Mock the data module
jest.mock('@/data/mockData', () => ({
  specialties: [
    { id: '1', name: 'Depresión', description: 'Tratamiento de depresión' },
    { id: '2', name: 'Ansiedad', description: 'Manejo de ansiedad' },
    { id: '3', name: 'Fobias', description: 'Tratamiento de fobias' }
  ]
}))

describe('GET /api/specialties', () => {
  it('returns all specialties', async () => {
    const request = new NextRequest('http://localhost:3000/api/specialties')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(3)
    expect(data[0]).toEqual({ id: '1', name: 'Depresión', description: 'Tratamiento de depresión' })
    expect(data[1]).toEqual({ id: '2', name: 'Ansiedad', description: 'Manejo de ansiedad' })
    expect(data[2]).toEqual({ id: '3', name: 'Fobias', description: 'Tratamiento de fobias' })
  })

  it('returns empty array when no specialties exist', async () => {
    // Mock empty specialties
    jest.doMock('@/data/mockData', () => ({
      specialties: []
    }))

    const request = new NextRequest('http://localhost:3000/api/specialties')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(0)
  })

  it('returns specialties with correct structure', async () => {
    const request = new NextRequest('http://localhost:3000/api/specialties')
    const response = await GET(request)
    const data = await response.json()

    expect(data[0]).toHaveProperty('id')
    expect(data[0]).toHaveProperty('name')
    expect(data[0]).toHaveProperty('description')
    expect(typeof data[0].id).toBe('string')
    expect(typeof data[0].name).toBe('string')
    expect(typeof data[0].description).toBe('string')
  })
})
