import { render, screen } from '@testing-library/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default medium size', () => {
    render(<LoadingSpinner />)

    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner.firstChild).toHaveClass('w-8', 'h-8')
  })

  it('renders with small size', () => {
    render(<LoadingSpinner size="sm" />)

    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner.firstChild).toHaveClass('w-4', 'h-4')
  })

  it('renders with large size', () => {
    render(<LoadingSpinner size="lg" />)

    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner.firstChild).toHaveClass('w-12', 'h-12')
  })

  it('has correct animation classes', () => {
    render(<LoadingSpinner />)

    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner.firstChild).toHaveClass('animate-spin', 'rounded-full')
  })
})
