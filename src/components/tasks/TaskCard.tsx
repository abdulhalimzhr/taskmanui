import { useState } from 'react'
import { Task } from '@/types/task'
import TaskStatusBadge from './TaskStatusBadge'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface TaskCardProps {
  task: Task
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export default function TaskCard({
  task,
  onDelete,
  isDeleting = false
}: TaskCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    onDelete(task.id)
    setShowDeleteModal(false)
  }

  return (
    <div className="card h-full flex flex-col min-w-0">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2 line-clamp-2 break-words overflow-hidden">
          {task.title}
        </h3>
        <TaskStatusBadge status={task.status} />
      </div>

      <div className="mb-4 border-b border-gray-200 py-4 flex-1">
        {task.description ? (
          <p className="text-gray-600 text-sm break-words line-clamp-3">
            {task.description}
          </p>
        ) : (
          <p className="text-gray-400 text-sm italic">
            No description provided
          </p>
        )}
      </div>

      <div className="flex flex-col items-end text-sm text-gray-500 mb-4">
        <span>
          Created:{' '}
          {new Date(task.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
        <span>
          Updated:{' '}
          {new Date(task.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      </div>

      <div className="flex gap-2 justify-end mt-auto flex-wrap">
        <Link
          href={`/tasks/edit/${task.id}`}
          className="flex items-center gap-1 btn-secondary text-xs"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="flex items-center gap-1 btn-danger text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
