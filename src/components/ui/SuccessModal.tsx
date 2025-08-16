'use client'

import { useEffect } from 'react'
import Modal from './Modal'
import { CheckCircle, X } from 'lucide-react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  actionText?: string
  onAction?: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  actionText,
  onAction,
  autoClose = true,
  autoCloseDelay = 3000
}: SuccessModalProps) {
  // Auto close functionality
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title ?? ''} size="sm">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>

        <p className="text-gray-700 mb-6 text-sm">{message}</p>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary text-sm">
            Close
          </button>
          {onAction && actionText && (
            <button onClick={onAction} className="btn-primary text-sm">
              {actionText}
            </button>
          )}
        </div>

        {autoClose && (
          <p className="text-sm text-gray-500 mt-3">
            This will close automatically in {autoCloseDelay / 1000} seconds
          </p>
        )}
      </div>
    </Modal>
  )
}
