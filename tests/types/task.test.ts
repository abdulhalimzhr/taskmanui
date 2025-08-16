import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStatus
} from '@/types/task'

describe('Task Types', () => {
  it('should have correct Task interface structure', () => {
    const task: Task = {
      id: '123',
      title: 'Test Task',
      description: 'Test Description',
      status: 'TO_DO',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }

    expect(task.id).toBe('123')
    expect(task.title).toBe('Test Task')
    expect(task.description).toBe('Test Description')
    expect(task.status).toBe('TO_DO')
    expect(task.createdAt).toBe('2023-01-01T00:00:00Z')
    expect(task.updatedAt).toBe('2023-01-01T00:00:00Z')
  })

  it('should allow optional description in Task', () => {
    const task: Task = {
      id: '123',
      title: 'Test Task',
      status: 'TO_DO',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }

    expect(task.description).toBeUndefined()
  })

  it('should have correct CreateTaskRequest structure', () => {
    const createRequest: CreateTaskRequest = {
      title: 'New Task',
      description: 'New Description'
    }

    expect(createRequest.title).toBe('New Task')
    expect(createRequest.description).toBe('New Description')
  })

  it('should allow optional description in CreateTaskRequest', () => {
    const createRequest: CreateTaskRequest = {
      title: 'New Task'
    }

    expect(createRequest.title).toBe('New Task')
    expect(createRequest.description).toBeUndefined()
  })

  it('should have correct UpdateTaskRequest structure', () => {
    const updateRequest: UpdateTaskRequest = {
      title: 'Updated Task',
      description: 'Updated Description',
      status: 'IN_PROGRESS'
    }

    expect(updateRequest.title).toBe('Updated Task')
    expect(updateRequest.description).toBe('Updated Description')
    expect(updateRequest.status).toBe('IN_PROGRESS')
  })

  it('should allow all optional fields in UpdateTaskRequest', () => {
    const updateRequest: UpdateTaskRequest = {}

    expect(updateRequest.title).toBeUndefined()
    expect(updateRequest.description).toBeUndefined()
    expect(updateRequest.status).toBeUndefined()
  })

  it('should have correct TaskStatus values', () => {
    const statuses: TaskStatus[] = ['TO_DO', 'IN_PROGRESS', 'DONE']

    statuses.forEach(status => {
      expect(['TO_DO', 'IN_PROGRESS', 'DONE']).toContain(status)
    })
  })
})
