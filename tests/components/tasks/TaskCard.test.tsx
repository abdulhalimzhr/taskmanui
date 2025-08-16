import { render, screen, fireEvent } from '@testing-library/react'
import TaskCard from '@/components/tasks/TaskCard'
import { Task } from '@/types/task'

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'TO_DO',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z'
}

const mockOnDelete = jest.fn()

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: jest.fn()
})

describe('TaskCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders task information correctly', () => {
    render(<TaskCard task={mockTask} onDelete={mockOnDelete} />)

    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })

  it('opens confirmation modal when delete button is clicked', () => {
    render(<TaskCard task={mockTask} onDelete={mockOnDelete} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    // Check that the confirmation modal is displayed
    expect(
      screen.getByText(/Are you sure you want to delete "Test Task"/)
    ).toBeInTheDocument()
  })

  it('calls onDelete when delete is confirmed in modal', () => {
    render(<TaskCard task={mockTask} onDelete={mockOnDelete} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    // Confirm the deletion in the modal
    const confirmButtons = screen.getAllByRole('button', { name: 'Delete' })
    const modalConfirmButton =
      confirmButtons.find(button => button.closest('[role="dialog"]')) ||
      confirmButtons[1] // Get the modal delete button (second one)
    fireEvent.click(modalConfirmButton)

    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('does not call onDelete when delete is cancelled in modal', () => {
    render(<TaskCard task={mockTask} onDelete={mockOnDelete} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    // Cancel the deletion in the modal
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)

    expect(mockOnDelete).not.toHaveBeenCalled()
  })

  it('renders edit link with correct href', () => {
    render(<TaskCard task={mockTask} onDelete={mockOnDelete} />)

    const editLink = screen.getByRole('link', { name: /edit/i })
    expect(editLink).toHaveAttribute('href', '/tasks/edit/1')
  })
})
