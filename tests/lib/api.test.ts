import { taskApi } from '@/lib/api'
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task'

// Mock axios before any imports
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn()
  }

  return {
    create: jest.fn(() => mockAxiosInstance),
    default: {
      create: jest.fn(() => mockAxiosInstance)
    }
  }
})

import axios from 'axios'

// Get the mocked axios instance
const mockAxios = axios as jest.Mocked<typeof axios>
const mockAxiosInstance = mockAxios.create() as any

describe('taskApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset the mock axios instance
    mockAxiosInstance.get.mockReset()
    mockAxiosInstance.post.mockReset()
    mockAxiosInstance.patch.mockReset()
    mockAxiosInstance.delete.mockReset()
  })

  describe('getTasks', () => {
    it('fetches tasks without parameters', async () => {
      const mockResponse = {
        data: {
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      }

      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      const result = await taskApi.getTasks()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tasks', {
        params: undefined
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('fetches tasks with parameters', async () => {
      const params = { status: 'TO_DO' as const, page: 2, limit: 5 }
      const mockResponse = {
        data: {
          data: [],
          total: 0,
          page: 2,
          limit: 5,
          totalPages: 0
        }
      }

      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      const result = await taskApi.getTasks(params)

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tasks', { params })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getTask', () => {
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

      mockAxiosInstance.get.mockResolvedValue({ data: mockTask })

      const result = await taskApi.getTask(taskId)

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/tasks/${taskId}`)
      expect(result).toEqual(mockTask)
    })
  })

  describe('createTask', () => {
    it('creates a new task', async () => {
      const newTask: CreateTaskRequest = {
        title: 'New Task',
        description: 'New Description'
      }

      const createdTask: Task = {
        id: '123',
        title: newTask.title,
        description: newTask.description,
        status: 'TO_DO',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }

      mockAxiosInstance.post.mockResolvedValue({ data: createdTask })

      const result = await taskApi.createTask(newTask)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/tasks', newTask)
      expect(result).toEqual(createdTask)
    })
  })

  describe('updateTask', () => {
    it('updates an existing task', async () => {
      const taskId = '123'
      const updateData: UpdateTaskRequest = {
        title: 'Updated Task',
        status: 'IN_PROGRESS'
      }

      const updatedTask: Task = {
        id: taskId,
        title: updateData.title!,
        description: 'Original Description',
        status: updateData.status!,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T12:00:00Z'
      }

      mockAxiosInstance.patch.mockResolvedValue({ data: updatedTask })

      const result = await taskApi.updateTask(taskId, updateData)

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        `/tasks/${taskId}`,
        updateData
      )
      expect(result).toEqual(updatedTask)
    })
  })

  describe('deleteTask', () => {
    it('deletes a task', async () => {
      const taskId = '123'

      mockAxiosInstance.delete.mockResolvedValue({})

      await taskApi.deleteTask(taskId)

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/tasks/${taskId}`)
    })
  })
})
