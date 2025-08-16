'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTask, useUpdateTask } from '@/hooks/useTasks'
import TaskForm from '@/components/forms/TaskForm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessModal from '@/components/ui/SuccessModal'
import { TaskStatus } from '@/types/task'

interface EditTaskPageProps {
  params: {
    id: string
  }
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const router = useRouter()
  const { data: task, isLoading, error, refetch } = useTask(params.id)
  const updateTaskMutation = useUpdateTask()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState('')

  const handleSubmit = async (data: {
    title: string
    description: string
    status?: TaskStatus
  }) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: params.id,
        task: {
          title: data.title,
          description: data.description || undefined,
          status: data.status
        }
      })
      setUpdatedTaskTitle(data.title)
      setShowSuccessModal(true)
    } catch (error) {
      alert('Failed to update task. Please try again.')
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    router.push('/')
  }

  const handleViewTasks = () => {
    setShowSuccessModal(false)
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorMessage
          message="Failed to load task. The task may not exist or there was a connection error."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  if (!task) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorMessage message="Task not found." />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Task</h1>
        <p className="text-gray-600 mt-2">Update the details of your task.</p>
      </div>

      <div className="card">
        <TaskForm
          initialData={{
            title: task.title,
            description: task.description || '',
            status: task.status
          }}
          onSubmit={handleSubmit}
          isLoading={updateTaskMutation.isLoading}
          showStatus={true}
        />
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        message={`Your task "${updatedTaskTitle}" has been updated successfully.`}
        actionText="View All Tasks"
        onAction={handleViewTasks}
        autoClose={false}
      />
    </div>
  )
}
