import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import TasksPage from '../../src/app/page'

// Mock the API before any imports
jest.mock('../../src/lib/api', () => ({
  taskApi: {
    getTasks: jest.fn(),
    deleteTask: jest.fn()
  }
}))

import { taskApi } from '../../src/lib/api'
const mockedTaskApi = taskApi as jest.Mocked<typeof taskApi>

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href
  }: {
    children: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>

  MockLink.displayName = 'MockLink'

  return MockLink
})

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
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

describe('TasksPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    mockedTaskApi.getTasks.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<TasksPage />, { wrapper: createWrapper() })

    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
  })

  it('renders tasks when data is loaded', async () => {
    const mockTasks = {
      data: [
        {
          id: '1',
          title: 'Test Task 1',
          description: 'Test Description 1',
          status: 'TO_DO' as const,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        },
        {
          id: '2',
          title: 'Test Task 2',
          description: 'Test Description 2',
          status: 'IN_PROGRESS' as const,
          createdAt: '2023-01-02T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z'
        }
      ],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1
    }

    mockedTaskApi.getTasks.mockResolvedValue(mockTasks)

    render(<TasksPage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    })

    expect(screen.getByText('2 tasks total')).toBeInTheDocument()
  })

  it('renders empty state when no tasks', async () => {
    const mockEmptyTasks = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    }

    mockedTaskApi.getTasks.mockResolvedValue(mockEmptyTasks)

    render(<TasksPage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('No tasks yet.')).toBeInTheDocument()
    })

    expect(screen.getByText('Create Your First Task')).toBeInTheDocument()
  })

  it('renders error state when API fails', async () => {
    mockedTaskApi.getTasks.mockRejectedValue(new Error('API Error'))

    render(<TasksPage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(
        screen.getByText(
          'Failed to load tasks. Please check your connection and try again.'
        )
      ).toBeInTheDocument()
    })

    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('filters tasks by status', async () => {
    const mockTasks = {
      data: [
        {
          id: '1',
          title: 'Todo Task',
          description: 'Todo Description',
          status: 'TO_DO' as const,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        }
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1
    }

    mockedTaskApi.getTasks.mockResolvedValue(mockTasks)

    render(<TasksPage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Todo Task')).toBeInTheDocument()
    })

    // Click on "To Do" filter button (not the badge)
    const toDoFilter = screen.getByRole('button', { name: 'To Do' })
    fireEvent.click(toDoFilter)

    await waitFor(() => {
      expect(mockedTaskApi.getTasks).toHaveBeenCalledWith({
        status: 'TO_DO',
        page: 1,
        limit: 6
      })
    })
  })

  it('handles task deletion', async () => {
    const mockTasks = {
      data: [
        {
          id: '1',
          title: 'Task to Delete',
          description: 'Description',
          status: 'TO_DO' as const,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        }
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1
    }

    const mockEmptyTasks = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    }

    mockedTaskApi.getTasks.mockResolvedValue(mockTasks)
    mockedTaskApi.deleteTask.mockResolvedValue()

    render(<TasksPage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Task to Delete')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', {
      name: /delete/i
    })
    fireEvent.click(deleteButton)

    // Check that the confirmation modal is displayed
    await waitFor(() => {
      expect(
        screen.getByText(
          'Are you sure you want to delete "Task to Delete"? This action cannot be undone.'
        )
      ).toBeInTheDocument()
    })

    // Confirm the deletion in the modal
    const confirmButtons = screen.getAllByRole('button', { name: 'Delete' })
    const modalConfirmButton =
      confirmButtons.find(button => button.closest('[role="dialog"]')) ||
      confirmButtons[1] // Get the modal delete button (second one)
    fireEvent.click(modalConfirmButton)

    await waitFor(() => {
      expect(mockedTaskApi.deleteTask).toHaveBeenCalledWith('1')
    })
  })

  it('handles pagination', async () => {
    const mockTasks = {
      data: [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          status: 'TO_DO' as const,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        }
      ],
      total: 25,
      page: 1,
      limit: 10,
      totalPages: 3
    }

    mockedTaskApi.getTasks.mockResolvedValue(mockTasks)

    render(<TasksPage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
    })

    const nextButton = screen.getByRole('button', { name: 'Next' })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(mockedTaskApi.getTasks).toHaveBeenCalledWith({
        status: undefined,
        page: 2,
        limit: 6
      })
    })
  })
})
