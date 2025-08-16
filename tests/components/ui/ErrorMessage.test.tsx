import { render, screen, fireEvent } from '@testing-library/react'
import ErrorMessage from '@/components/ui/ErrorMessage'

const mockOnRetry = jest.fn()

describe('ErrorMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders error message', () => {
    render(<ErrorMessage message="Test error message" />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('renders retry button when onRetry is provided', () => {
    render(<ErrorMessage message="Error occurred" onRetry={mockOnRetry} />)

    const retryButton = screen.getByRole('button', { name: /try again/i })
    expect(retryButton).toBeInTheDocument()
  })

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Error occurred" />)

    const retryButton = screen.queryByRole('button', { name: /try again/i })
    expect(retryButton).not.toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', () => {
    render(<ErrorMessage message="Error occurred" onRetry={mockOnRetry} />)

    const retryButton = screen.getByRole('button', { name: /try again/i })
    fireEvent.click(retryButton)

    expect(mockOnRetry).toHaveBeenCalledTimes(1)
  })

  it('displays error icon', () => {
    render(<ErrorMessage message="Error occurred" />)

    // The AlertCircle icon should be present
    const errorIcon = screen.getByRole('img', { hidden: true })
    expect(errorIcon).toBeInTheDocument()
  })
})
