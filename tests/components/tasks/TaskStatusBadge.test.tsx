import { render, screen } from '@testing-library/react'
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge'

describe('TaskStatusBadge', () => {
  it('renders TO_DO status correctly', () => {
    render(<TaskStatusBadge status="TO_DO" />)

    const badge = screen.getByText('To Do')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800')
  })

  it('renders IN_PROGRESS status correctly', () => {
    render(<TaskStatusBadge status="IN_PROGRESS" />)

    const badge = screen.getByText('In Progress')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800')
  })

  it('renders DONE status correctly', () => {
    render(<TaskStatusBadge status="DONE" />)

    const badge = screen.getByText('Done')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-green-100', 'text-green-800')
  })
})
