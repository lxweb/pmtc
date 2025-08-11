import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock data for testing
const mockPsychologist = {
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

// Simple PsychologistCard component for testing
function PsychologistCard({ psychologist, onBookSession }: any) {
  const [showAvailability, setShowAvailability] = React.useState(false)

  const getDayName = (day: string) => {
    const days: Record<string, string> = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    }
    return days[day] || day
  }

  return (
    <div>
      <h3>{psychologist.name}</h3>
      <div>
        {psychologist.specialties.map((specialty: any) => (
          <span key={specialty.id}>{specialty.name}</span>
        ))}
      </div>
      <button onClick={() => onBookSession(psychologist.id)}>
        Agendar Sesión
      </button>
      <button onClick={() => setShowAvailability(!showAvailability)}>
        {showAvailability ? 'Ocultar' : 'Ver'} disponibilidad
      </button>
      {showAvailability && (
        <div>
          {psychologist.availability
            .filter(slot => slot.isAvailable)
            .map(slot => (
              <div key={slot.id}>
                <span>{getDayName(slot.day)}</span>
                <span>{slot.startTime} - {slot.endTime}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

describe('PsychologistCard', () => {
  const mockOnBookSession = jest.fn()

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
})
