import React from 'react'

const Modal = ({ children, isOpen, onClose }) => {
     if (!isOpen) return null;
  return (
     <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold cursor-pointer"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal