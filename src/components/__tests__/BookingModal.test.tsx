import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import BookingModal from '../BookingModal'
import { Psychologist, Specialty } from '@/types'

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

const mockSpecialties: Specialty[] = [
  { id: '1', name: 'Depresión', description: 'Tratamiento de depresión' },
  { id: '2', name: 'Ansiedad', description: 'Manejo de ansiedad' },
  { id: '3', name: 'Fobias', description: 'Tratamiento de fobias' }
]

const mockOnClose = jest.fn()
const mockOnBook = jest.fn()

describe('BookingModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal when isOpen is true and psychologist is provided', () => {
    render(
      <BookingModal
        psychologist={mockPsychologist}
        specialties={mockSpecialties}
        isOpen={true}
        onClose={mockOnClose}
        onBook={mockOnBook}
      />
    )

    expect(screen.getByText('Agendar Sesión con Dr. María González')).toBeInTheDocument()
    expect(screen.getByText('Nombre del paciente')).toBeInTheDocument()
    expect(screen.getByText('Fecha')).toBeInTheDocument()
    expect(screen.getByText('Horario')).toBeInTheDocument()
    expect(screen.getByText('Especialidad')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <BookingModal
        psychologist={mockPsychologist}
        specialties={mockSpecialties}
        isOpen={false}
        onClose={mockOnClose}
        onBook={mockOnBook}
      />
    )

    expect(screen.queryByText('Agendar Sesión con Dr. María González')).not.toBeInTheDocument()
  })

  it('does not render when psychologist is null', () => {
    render(
      <BookingModal
        psychologist={null}
        specialties={mockSpecialties}
        isOpen={true}
        onClose={mockOnClose}
        onBook={mockOnBook}
      />
    )

    expect(screen.queryByText('Agendar Sesión')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(
      <BookingModal
        psychologist={mockPsychologist}
        specialties={mockSpecialties}
        isOpen={true}
        onClose={mockOnClose}
        onBook={mockOnBook}
      />
    )

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when cancel button is clicked', () => {
    render(
      <BookingModal
        psychologist={mockPsychologist}
        specialties={mockSpecialties}
        isOpen={true}
        onClose={mockOnClose}
        onBook={mockOnBook}
      />
    )

    const cancelButton = screen.getByText('Cancelar')
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('populates time slots from available psychologist slots', () => {
    render(
      <BookingModal
        psychologist={mockPsychologist}
        specialties={mockSpecialties}
        isOpen={true}
        onClose={mockOnClose}
        onBook={mockOnBook}
      />
    )

    const timeSelect = screen.getByRole('combobox', { name: /horario/i })
    fireEvent.click(timeSelect)

    expect(screen.getByText('09:00')).toBeInTheDocument()
    expect(screen.getByText('14:00')).toBeInTheDocument()
    expect(screen.queryByText('10:00')).not.toBeInTheDocument() // Not available
  })

  it('populates specialties from psychologist', () => {
    render(
      <BookingModal
        psychologist={mockPsychologist}
        specialties={mockSpecialties}
        isOpen={true}
        onClose={mockOnClose}
        onBook={mockOnBook}
      />
    )

    const specialtySelect = screen.getByRole('combobox', { name: /especialidad/i })
    fireEvent.click(specialtySelect)

    expect(screen.getByText('Depresión')).toBeInTheDocument()
    expect(screen.getByText('Ansiedad')).toBeInTheDocument()
  })

  it('submits form with correct data', async () => {
    render(
      <BookingModal
        psychologist={mockPsychologist}
        specialties={mockSpecialties}
        isOpen={true}
        onClose={mockOnClose}
        onBook={mockOnBook}
      />
    )

    // Fill form
    const patientNameInput = screen.getByLabelText('Nombre del paciente')
    const dateInput = screen.getByLabelText('Fecha')
    const timeSelect = screen.getByRole('combobox', { name: /horario/i })
    const specialtySelect = screen.getByRole('combobox', { name: /especialidad/i })

    fireEvent.change(patientNameInput, { target: { value: 'Juan Pérez' } })
    fireEvent.change(dateInput, { target: { value: '2024-01-15' } })
    fireEvent.change(timeSelect, { target: { value: '09:00' } })
    fireEvent.change(specialtySelect, { target: { value: '1' } })

    // Submit form
    const submitButton = screen.getByText('Agendar Sesión')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnBook).toHaveBeenCalledWith({
        psychologistId: '1',
        patientName: 'Juan Pérez',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '09:00',
        specialty: '1'
      })
    })
  })

  it('shows loading state during submission', async () => {
    mockOnBook.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(
      <BookingModal
        psychologist={mockPsychologist}
        specialties={mockSpecialties}
        isOpen={true}
        onClose={mockOnClose}
        onBook={mockOnBook}
      />
    )

    // Fill form
    const patientNameInput = screen.getByLabelText('Nombre del paciente')
    const dateInput = screen.getByLabelText('Fecha')
    const timeSelect = screen.getByRole('combobox', { name: /horario/i })
    const specialtySelect = screen.getByRole('combobox', { name: /especialidad/i })

    fireEvent.change(patientNameInput, { target: { value: 'Juan Pérez' } })
    fireEvent.change(dateInput, { target: { value: '2024-01-15' } })
    fireEvent.change(timeSelect, { target: { value: '09:00' } })
    fireEvent.change(specialtySelect, { target: { value: '1' } })

    // Submit form
    const submitButton = screen.getByText('Agendar Sesión')
    fireEvent.click(submitButton)

    // Should show loading state
    expect(screen.getByText('Agendando...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('resets form after successful submission', async () => {
    render(
      <BookingModal
        psychologist={mockPsychologist}
        specialties={mockSpecialties}
        isOpen={true}
        onClose={mockOnClose}
        onBook={mockOnBook}
      />
    )

    // Fill form
    const patientNameInput = screen.getByLabelText('Nombre del paciente')
    const dateInput = screen.getByLabelText('Fecha')
    const timeSelect = screen.getByRole('combobox', { name: /horario/i })
    const specialtySelect = screen.getByRole('combobox', { name: /especialidad/i })

    fireEvent.change(patientNameInput, { target: { value: 'Juan Pérez' } })
    fireEvent.change(dateInput, { target: { value: '2024-01-15' } })
    fireEvent.change(timeSelect, { target: { value: '09:00' } })
    fireEvent.change(specialtySelect, { target: { value: '1' } })

    // Submit form
    const submitButton = screen.getByText('Agendar Sesión')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('requires all fields to be filled', () => {
    render(
      <BookingModal
        psychologist={mockPsychologist}
        specialties={mockSpecialties}
        isOpen={true}
        onClose={mockOnClose}
        onBook={mockOnBook}
      />
    )

    const patientNameInput = screen.getByLabelText('Nombre del paciente')
    const dateInput = screen.getByLabelText('Fecha')
    const timeSelect = screen.getByRole('combobox', { name: /horario/i })
    const specialtySelect = screen.getByRole('combobox', { name: /especialidad/i })

    expect(patientNameInput).toBeRequired()
    expect(dateInput).toBeRequired()
    expect(timeSelect).toBeRequired()
    expect(specialtySelect).toBeRequired()
  })
})
