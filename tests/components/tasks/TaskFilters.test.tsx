import { render, screen, fireEvent } from '@testing-library/react'
import TaskFilters from '@/components/tasks/TaskFilters'

const mockOnStatusChange = jest.fn()

describe('TaskFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all filter options', () => {
    render(<TaskFilters onStatusChange={mockOnStatusChange} />)

    expect(screen.getByText('All Tasks')).toBeInTheDocument()
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('highlights the current status filter', () => {
    render(
      <TaskFilters
        currentStatus="IN_PROGRESS"
        onStatusChange={mockOnStatusChange}
      />
    )

    const inProgressButton = screen.getByText('In Progress')
    expect(inProgressButton).toHaveClass('bg-primary-600', 'text-white')

    const allTasksButton = screen.getByText('All Tasks')
    expect(allTasksButton).toHaveClass('bg-white', 'text-gray-700')
  })

  it('calls onStatusChange when filter is clicked', () => {
    render(<TaskFilters onStatusChange={mockOnStatusChange} />)

    const toDoButton = screen.getByText('To Do')
    fireEvent.click(toDoButton)

    expect(mockOnStatusChange).toHaveBeenCalledWith('TO_DO')
  })

  it('calls onStatusChange with undefined for All Tasks', () => {
    render(
      <TaskFilters currentStatus="TO_DO" onStatusChange={mockOnStatusChange} />
    )

    const allTasksButton = screen.getByText('All Tasks')
    fireEvent.click(allTasksButton)

    expect(mockOnStatusChange).toHaveBeenCalledWith(undefined)
  })
})
