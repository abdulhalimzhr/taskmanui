import { TaskStatus } from '@/types/task'

interface TaskStatusBadgeProps {
  status: TaskStatus
}

const statusConfig = {
  TO_DO: {
    label: 'To Do',
    className: 'bg-gray-100 text-gray-800'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-800'
  },
  DONE: {
    label: 'Done',
    className: 'bg-green-100 text-green-800'
  }
}

export default function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
