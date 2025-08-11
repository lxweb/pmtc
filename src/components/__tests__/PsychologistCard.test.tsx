import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import PsychologistCard from '../PsychologistCard'
import { Psychologist } from '@/types'

// Mock data for testing
const mockPsychologist: Psychologist = {
  id: '1',
  name: 'Dr. María González',
  specialties: [
    { id: '1', name: 'Depresión', description: 'Tratamiento de depresión' },
    { id: '2', name: 'Ansiedad', description: 'Manejo de ansiedad' }
  ],
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
    },
    {
      id: '3',
      day: 'wednesday',
      startTime: '10:00',
      endTime: '11:00',
      isAvailable: false
    }
  ],
  timezone: 'America/Argentina/Buenos_Aires'
}

const mockOnBookSession = jest.fn()

describe('PsychologistCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders psychologist information correctly', () => {
    render(
      <PsychologistCard 
        psychologist={mockPsychologist} 
        onBookSession={mockOnBookSession} 
      />
    )

    expect(screen.getByText('Dr. María González')).toBeInTheDocument()
    expect(screen.getByText('Depresión')).toBeInTheDocument()
    expect(screen.getByText('Ansiedad')).toBeInTheDocument()
    expect(screen.getByText('Agendar Sesión')).toBeInTheDocument()
  })

  it('displays specialties correctly', () => {
    render(
      <PsychologistCard 
        psychologist={mockPsychologist} 
        onBookSession={mockOnBookSession} 
      />
    )

    const specialtyElements = screen.getAllByText(/Depresión|Ansiedad/)
    expect(specialtyElements).toHaveLength(2)
  })

  it('calls onBookSession when booking button is clicked', () => {
    render(
      <PsychologistCard 
        psychologist={mockPsychologist} 
        onBookSession={mockOnBookSession} 
      />
    )

    const bookButton = screen.getByText('Agendar Sesión')
    fireEvent.click(bookButton)

    expect(mockOnBookSession).toHaveBeenCalledWith('1')
    expect(mockOnBookSession).toHaveBeenCalledTimes(1)
  })

  it('toggles availability visibility when button is clicked', () => {
    render(
      <PsychologistCard 
        psychologist={mockPsychologist} 
        onBookSession={mockOnBookSession} 
      />
    )

    // Initially, availability should not be visible
    expect(screen.queryByText('Lunes')).not.toBeInTheDocument()
    expect(screen.queryByText('Martes')).not.toBeInTheDocument()

    // Click to show availability
    const toggleButton = screen.getByText('Ver disponibilidad')
    fireEvent.click(toggleButton)

    // Now availability should be visible
    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('Martes')).toBeInTheDocument()
    expect(screen.getByText('09:00 - 10:00')).toBeInTheDocument()
    expect(screen.getByText('14:00 - 15:00')).toBeInTheDocument()

    // Click to hide availability
    const hideButton = screen.getByText('Ocultar disponibilidad')
    fireEvent.click(hideButton)

    // Availability should be hidden again
    expect(screen.queryByText('Lunes')).not.toBeInTheDocument()
    expect(screen.queryByText('Martes')).not.toBeInTheDocument()
  })

  it('only shows available time slots', () => {
    render(
      <PsychologistCard 
        psychologist={mockPsychologist} 
        onBookSession={mockOnBookSession} 
      />
    )

    const toggleButton = screen.getByText('Ver disponibilidad')
    fireEvent.click(toggleButton)

    // Should show available slots
    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('Martes')).toBeInTheDocument()
    
    // Should not show unavailable slots
    expect(screen.queryByText('Miércoles')).not.toBeInTheDocument()
  })

  it('translates day names correctly', () => {
    render(
      <PsychologistCard 
        psychologist={mockPsychologist} 
        onBookSession={mockOnBookSession} 
      />
    )

    const toggleButton = screen.getByText('Ver disponibilidad')
    fireEvent.click(toggleButton)

    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('Martes')).toBeInTheDocument()
  })

  it('displays time slots in correct format', () => {
    render(
      <PsychologistCard 
        psychologist={mockPsychologist} 
        onBookSession={mockOnBookSession} 
      />
    )

    const toggleButton = screen.getByText('Ver disponibilidad')
    fireEvent.click(toggleButton)

    expect(screen.getByText('09:00 - 10:00')).toBeInTheDocument()
    expect(screen.getByText('14:00 - 15:00')).toBeInTheDocument()
  })
})
