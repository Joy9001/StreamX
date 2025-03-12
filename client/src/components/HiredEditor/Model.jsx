import React, { useEffect } from 'react'

const Model = ({ isOpen, onClose, children }) => {
  // Close modal with ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      // Restore scrolling when modal is closed
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Stop propagation to prevent closing the modal when clicking inside it
  const handleModalClick = (e) => {
    e.stopPropagation()
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6'>
      {/* Backdrop - animated */}
      <div
        className='fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity'
        onClick={onClose}
        style={{
          animation: 'fadeIn 0.2s ease-out forwards',
        }}></div>

      {/* Modal Content - animated */}
      <div
        className='relative z-50 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 transition-all'
        onClick={handleModalClick}
        style={{
          animation: 'scaleIn 0.3s ease-out forwards',
        }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300'
          aria-label='Close'>
          <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>

        {/* Content with scrollbar */}
        <div className='custom-scrollbar overflow-y-auto'>{children}</div>
      </div>

      {/* CSS for animations */}
      <style jsx='true'>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}

export default Model
