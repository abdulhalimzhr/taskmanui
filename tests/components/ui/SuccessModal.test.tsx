import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SuccessModal from '@/components/ui/SuccessModal'

// Mock timers
jest.useFakeTimers()

describe('SuccessModal', () => {
  const mockOnClose = jest.fn()
  const mockOnAction = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it('renders success modal with correct content', () => {
    render(
      <SuccessModal
        isOpen={true}
        onClose={mockOnClose}
        title="Success!"
        message="Operation completed successfully"
        autoClose={false}
      />
    )

    expect(screen.getByText('Success!')).toBeInTheDocument()
    expect(
      screen.getByText('Operation completed successfully')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('shows action button when provided', () => {
    render(
      <SuccessModal
        isOpen={true}
        onClose={mockOnClose}
        title="Success!"
        message="Task created"
        actionText="View Tasks"
        onAction={mockOnAction}
        autoClose={false}
      />
    )

    expect(
      screen.getByRole('button', { name: 'View Tasks' })
    ).toBeInTheDocument()
  })

  it('calls onAction when action button is clicked', () => {
    render(
      <SuccessModal
        isOpen={true}
        onClose={mockOnClose}
        title="Success!"
        message="Task created"
        actionText="View Tasks"
        onAction={mockOnAction}
        autoClose={false}
      />
    )

    const actionButton = screen.getByRole('button', { name: 'View Tasks' })
    fireEvent.click(actionButton)

    expect(mockOnAction).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when close button is clicked', () => {
    render(
      <SuccessModal
        isOpen={true}
        onClose={mockOnClose}
        title="Success!"
        message="Task created"
        autoClose={false}
      />
    )

    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('auto closes after specified delay', async () => {
    render(
      <SuccessModal
        isOpen={true}
        onClose={mockOnClose}
        title="Success!"
        message="Task created"
        autoClose={true}
        autoCloseDelay={2000}
      />
    )

    expect(
      screen.getByText('This will close automatically in 2 seconds')
    ).toBeInTheDocument()

    // Fast forward time
    jest.advanceTimersByTime(2000)

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  it('does not show auto close message when autoClose is false', () => {
    render(
      <SuccessModal
        isOpen={true}
        onClose={mockOnClose}
        title="Success!"
        message="Task created"
        autoClose={false}
      />
    )

    expect(
      screen.queryByText(/this will close automatically/i)
    ).not.toBeInTheDocument()
  })
})
