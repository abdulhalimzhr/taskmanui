'use client'

import { useForm } from 'react-hook-form'
import { TaskStatus } from '@/types/task'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface TaskFormData {
  title: string
  description: string
  status?: TaskStatus
}

interface TaskFormProps {
  initialData?: Partial<TaskFormData>
  onSubmit: (data: TaskFormData) => Promise<void>
  isLoading?: boolean
  showStatus?: boolean
}

export default function TaskForm({
  initialData,
  onSubmit,
  isLoading = false,
  showStatus = false
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TaskFormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'TO_DO'
    }
  })

  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title Field */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Title *
        </label>
        <input
          type="text"
          id="title"
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 1,
              message: 'Title cannot be empty'
            },
            maxLength: {
              value: 200,
              message: 'Title must be less than 200 characters'
            }
          })}
          className={`input-field ${
            errors.title ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description', {
            maxLength: {
              value: 1000,
              message: 'Description must be less than 1000 characters'
            }
          })}
          className={`input-field resize-none ${
            errors.description ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder="Enter task description (optional)"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Status Field (only shown for edit) */}
      {showStatus && (
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Status
          </label>
          <select id="status" {...register('status')} className="input-field">
            <option value="TO_DO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4 items-center flex-wrap justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Saving...
            </>
          ) : showStatus ? (
            'Update Task'
          ) : (
            'Create Task'
          )}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
