import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TaskForm from '@/components/forms/TaskForm'

const mockOnSubmit = jest.fn()

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form fields correctly', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create task/i })
    ).toBeInTheDocument()
  })

  it('shows status field when showStatus is true', () => {
    render(<TaskForm onSubmit={mockOnSubmit} showStatus={true} />)

    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /update task/i })
    ).toBeInTheDocument()
  })

  it('validates required title field', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /create task/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    mockOnSubmit.mockResolvedValue(undefined)

    render(<TaskForm onSubmit={mockOnSubmit} />)

    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole('button', { name: /create task/i })

    fireEvent.change(titleInput, { target: { value: 'Test Task' } })
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Description' }
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        status: 'TO_DO'
      })
    })
  })

  it('pre-fills form with initial data', () => {
    const initialData = {
      title: 'Initial Title',
      description: 'Initial Description',
      status: 'IN_PROGRESS' as const
    }

    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        initialData={initialData}
        showStatus={true}
      />
    )

    expect(screen.getByDisplayValue('Initial Title')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Initial Description')).toBeInTheDocument()

    // Check if the select has the correct value
    const statusSelect = screen.getByLabelText(/status/i) as HTMLSelectElement
    expect(statusSelect.value).toBe('IN_PROGRESS')
  })
})
