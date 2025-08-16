import axios from 'axios'
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TasksResponse,
  TaskStatus
} from '@/types/task'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const taskApi = {
  // Get all tasks with optional filtering and pagination
  getTasks: async (params?: {
    status?: TaskStatus
    page?: number
    limit?: number
  }): Promise<TasksResponse> => {
    const response = await api.get('/tasks', { params })
    return response.data
  },

  // Get a single task by ID
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },

  // Create a new task
  createTask: async (task: CreateTaskRequest): Promise<Task> => {
    const response = await api.post('/tasks', task)
    return response.data
  },

  // Update an existing task
  updateTask: async (id: string, task: UpdateTaskRequest): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, task)
    return response.data
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  }
}

export default api
