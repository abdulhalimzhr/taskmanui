import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import EditTaskPage from '../../src/app/tasks/edit/[id]/page'

// Mock the API before any imports
jest.mock('../../src/lib/api', () => ({
  taskApi: {
    getTask: jest.fn(),
    updateTask: jest.fn()
  }
}))

import { taskApi } from '../../src/lib/api'
const mockedTaskApi = taskApi as jest.Mocked<typeof taskApi>

// Mock useRouter
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Mock window.alert
Object.defineProperty(window, 'alert', {
  writable: true,
  value: jest.fn()
})

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  TestWrapper.displayName = 'TestWrapper'

  return TestWrapper
}

const mockTask = {
  id: '123',
  title: 'Existing Task',
  description: 'Existing Description',
  status: 'IN_PROGRESS' as const,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z'
}

describe('EditTaskPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    mockedTaskApi.getTask.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<EditTaskPage params={{ id: '123' }} />, {
      wrapper: createWrapper()
    })

    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
  })

  it('renders edit form with existing task data', async () => {
    mockedTaskApi.getTask.mockResolvedValue(mockTask)

    render(<EditTaskPage params={{ id: '123' }} />, {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(screen.getByText('Edit Task')).toBeInTheDocument()
    })

    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument()

    const statusSelect = screen.getByLabelText(/status/i) as HTMLSelectElement
    expect(statusSelect.value).toBe('IN_PROGRESS')
  })

  it('renders error when task not found', async () => {
    mockedTaskApi.getTask.mockRejectedValue(new Error('Task not found'))

    render(<EditTaskPage params={{ id: '123' }} />, {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(
        screen.getByText(
          'Failed to load task. The task may not exist or there was a connection error.'
        )
      ).toBeInTheDocument()
    })
  })

  it('updates task successfully and shows success modal', async () => {
    const updatedTask = {
      ...mockTask,
      title: 'Updated Task',
      status: 'DONE' as const
    }

    mockedTaskApi.getTask.mockResolvedValue(mockTask)
    mockedTaskApi.updateTask.mockResolvedValue(updatedTask)

    render(<EditTaskPage params={{ id: '123' }} />, {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument()
    })

    const titleInput = screen.getByLabelText(/title/i)
    const statusSelect = screen.getByLabelText(/status/i)
    const submitButton = screen.getByRole('button', {
      name: /update task/i
    })

    fireEvent.change(titleInput, {
      target: { value: 'Updated Task' }
    })
    fireEvent.change(statusSelect, { target: { value: 'DONE' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockedTaskApi.updateTask).toHaveBeenCalledWith('123', {
        title: 'Updated Task',
        description: 'Existing Description',
        status: 'DONE'
      })
    })

    // Check that success modal appears
    await waitFor(() => {
      expect(
        screen.getByText(
          'Your task "Updated Task" has been updated successfully.'
        )
      ).toBeInTheDocument()
    })

    // Modal should close when clicking "View All Tasks" button
    const viewTasksButton = screen.getByRole('button', {
      name: 'View All Tasks'
    })
    fireEvent.click(viewTasksButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('handles update error', async () => {
    mockedTaskApi.getTask.mockResolvedValue(mockTask)
    mockedTaskApi.updateTask.mockRejectedValue(new Error('Update failed'))

    render(<EditTaskPage params={{ id: '123' }} />, {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', {
      name: /update task/i
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Failed to update task. Please try again.'
      )
    })
  })

  it('shows loading state during update', async () => {
    mockedTaskApi.getTask.mockResolvedValue(mockTask)
    mockedTaskApi.updateTask.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<EditTaskPage params={{ id: '123' }} />, {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', {
      name: /update task/i
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Saving...')).toBeInTheDocument()
    })
  })
})
