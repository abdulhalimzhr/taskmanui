import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import {
  useTasks,
  useTask,
  useCreateTask,
  useUpdateTask,
  useDeleteTask
} from '../../src/hooks/useTasks'
import { Task } from '../../src/types/task'

// Mock the API before any imports
jest.mock('../../src/lib/api', () => ({
  taskApi: {
    getTasks: jest.fn(),
    getTask: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn()
  }
}))

import { taskApi } from '../../src/lib/api'
const mockedTaskApi = taskApi as jest.Mocked<typeof taskApi>

// Create a wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return Wrapper
}

describe('useTasks hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('useTasks', () => {
    it('fetches tasks successfully', async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      }

      mockedTaskApi.getTasks.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResponse)
      expect(mockedTaskApi.getTasks).toHaveBeenCalledWith(undefined)
    })

    it('fetches tasks with parameters', async () => {
      const params = { status: 'TO_DO' as const, page: 2, limit: 5 }
      const mockResponse = {
        data: [],
        total: 0,
        page: 2,
        limit: 5,
        totalPages: 0
      }

      mockedTaskApi.getTasks.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useTasks(params), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockedTaskApi.getTasks).toHaveBeenCalledWith(params)
    })
  })

  describe('useTask', () => {
    it('fetches a single task', async () => {
      const taskId = '123'
      const mockTask: Task = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'TO_DO',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }

      mockedTaskApi.getTask.mockResolvedValue(mockTask)

      const { result } = renderHook(() => useTask(taskId), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockTask)
      expect(mockedTaskApi.getTask).toHaveBeenCalledWith(taskId)
    })
  })

  describe('useCreateTask', () => {
    it('creates a task successfully', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description'
      }

      const createdTask: Task = {
        id: '123',
        ...newTask,
        status: 'TO_DO' as const,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }

      mockedTaskApi.createTask.mockResolvedValue(createdTask)

      const { result } = renderHook(() => useCreateTask(), {
        wrapper: createWrapper()
      })

      result.current.mutate(newTask)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockedTaskApi.createTask).toHaveBeenCalledWith(newTask)
    })
  })

  describe('useUpdateTask', () => {
    it('updates a task successfully', async () => {
      const taskId = '123'
      const updateData = {
        title: 'Updated Task',
        status: 'IN_PROGRESS' as const
      }

      const updatedTask: Task = {
        id: taskId,
        title: updateData.title,
        description: 'Original Description',
        status: updateData.status,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T12:00:00Z'
      }

      mockedTaskApi.updateTask.mockResolvedValue(updatedTask)

      const { result } = renderHook(() => useUpdateTask(), {
        wrapper: createWrapper()
      })

      result.current.mutate({ id: taskId, task: updateData })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockedTaskApi.updateTask).toHaveBeenCalledWith(taskId, updateData)
    })
  })

  describe('useDeleteTask', () => {
    it('deletes a task successfully', async () => {
      const taskId = '123'

      mockedTaskApi.deleteTask.mockResolvedValue()

      const { result } = renderHook(() => useDeleteTask(), {
        wrapper: createWrapper()
      })

      result.current.mutate(taskId)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockedTaskApi.deleteTask).toHaveBeenCalledWith(taskId)
    })
  })
})
