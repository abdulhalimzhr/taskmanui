'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useTasks, useDeleteTask } from '@/hooks/useTasks'
import { TaskStatus } from '@/types/task'
import TaskCard from '@/components/tasks/TaskCard'
import TaskFilters from '@/components/tasks/TaskFilters'
import Pagination from '@/components/tasks/Pagination'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function TasksPage() {
  const [currentStatus, setCurrentStatus] = useState<TaskStatus | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6) // 6 items per page for a clean, focused layout

  const { data, isLoading, error, refetch } = useTasks({
    status: currentStatus,
    page: currentPage,
    limit: itemsPerPage
  })

  const deleteTaskMutation = useDeleteTask()

  const handleStatusChange = (status?: TaskStatus) => {
    setCurrentStatus(status)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTaskMutation.mutateAsync(id)
    } catch (error) {
      alert('Failed to delete task. Please try again.')
    }
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
      <ErrorMessage
        message="Failed to load tasks. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    )
  }

  const tasks = data?.data || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600">
            {data?.total || 0} task
            {(data?.total || 0) !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/tasks/create"
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-3 h-3" />
          Add New Task
        </Link>
      </div>

      {/* Filters */}
      <TaskFilters
        currentStatus={currentStatus}
        onStatusChange={handleStatusChange}
      />
      {/* Tasks Grid */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {currentStatus
              ? 'No tasks found with the selected filter.'
              : 'No tasks yet.'}
          </div>
          <Link href="/tasks/create" className="btn-primary">
            Create Your First Task
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                isDeleting={deleteTaskMutation.isLoading}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={data?.total}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}
    </div>
  )
}
