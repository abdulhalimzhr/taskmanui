import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import CreateTaskPage from '../../src/app/tasks/create/page'

// Mock the API before any imports
jest.mock('../../src/lib/api', () => ({
  taskApi: {
    createTask: jest.fn()
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

describe('CreateTaskPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders create task form', () => {
    render(<CreateTaskPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Create New Task')).toBeInTheDocument()
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create task/i })
    ).toBeInTheDocument()
  })

  it('creates task successfully and shows success modal', async () => {
    const mockCreatedTask = {
      id: '123',
      title: 'New Task',
      description: 'New Description',
      status: 'TO_DO' as const,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }

    mockedTaskApi.createTask.mockResolvedValue(mockCreatedTask)

    render(<CreateTaskPage />, { wrapper: createWrapper() })

    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole('button', {
      name: /create task/i
    })

    fireEvent.change(titleInput, { target: { value: 'New Task' } })
    fireEvent.change(descriptionInput, {
      target: { value: 'New Description' }
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockedTaskApi.createTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description'
      })
    })

    // Check that success modal appears
    await waitFor(() => {
      expect(
        screen.getByText('Your task "New Task" has been created successfully.')
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

  it('handles creation error', async () => {
    mockedTaskApi.createTask.mockRejectedValue(new Error('API Error'))

    render(<CreateTaskPage />, { wrapper: createWrapper() })

    const titleInput = screen.getByLabelText(/title/i)
    const submitButton = screen.getByRole('button', {
      name: /create task/i
    })

    fireEvent.change(titleInput, { target: { value: 'New Task' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Failed to create task. Please try again.'
      )
    })
  })

  it('shows loading state during creation', async () => {
    mockedTaskApi.createTask.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<CreateTaskPage />, { wrapper: createWrapper() })

    const titleInput = screen.getByLabelText(/title/i)
    const submitButton = screen.getByRole('button', {
      name: /create task/i
    })

    fireEvent.change(titleInput, { target: { value: 'New Task' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Saving...')).toBeInTheDocument()
    })
  })
})
