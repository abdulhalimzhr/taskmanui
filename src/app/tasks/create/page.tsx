'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateTask } from '@/hooks/useTasks'
import TaskForm from '@/components/forms/TaskForm'
import SuccessModal from '@/components/ui/SuccessModal'

export default function CreateTaskPage() {
  const router = useRouter()
  const createTaskMutation = useCreateTask()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdTaskTitle, setCreatedTaskTitle] = useState('')

  const handleSubmit = async (data: { title: string; description: string }) => {
    try {
      await createTaskMutation.mutateAsync({
        title: data.title,
        description: data.description || undefined
      })
      setCreatedTaskTitle(data.title)
      setShowSuccessModal(true)
    } catch (error) {
      alert('Failed to create task. Please try again.')
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
        <p className="text-gray-600 mt-2 text-sm">Add a new task to your task list.</p>
      </div>

      <div className="card">
        <TaskForm
          onSubmit={handleSubmit}
          isLoading={createTaskMutation.isLoading}
        />
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        message={`Your task "${createdTaskTitle}" has been created successfully.`}
        actionText="View All Tasks"
        onAction={handleViewTasks}
        autoClose={false}
      />
    </div>
  )
}
