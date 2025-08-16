import { TaskStatus } from '@/types/task'

interface TaskFiltersProps {
  currentStatus?: TaskStatus
  onStatusChange: (status?: TaskStatus) => void
}

const statusOptions = [
  { value: undefined, label: 'All Tasks' },
  { value: 'TO_DO' as TaskStatus, label: 'To Do' },
  { value: 'IN_PROGRESS' as TaskStatus, label: 'In Progress' },
  { value: 'DONE' as TaskStatus, label: 'Done' }
]

export default function TaskFilters({
  currentStatus,
  onStatusChange
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map(option => (
        <button
          key={option.label}
          onClick={() => onStatusChange(option.value)}
          className={`px-2 py-1 rounded-lg font-medium transition-colors text-sm ${
            currentStatus === option.value
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
