import React from 'react'

function GigHeader({ onEditClick }) {
  return (
    <div className='flex h-16 items-center justify-between bg-gray-50 px-8'>
      <div>
        <h1 className='text-2xl font-bold'>
          Gig <span className='text-red-500'>Dashboard</span>
        </h1>
      </div>
      <div>
        <button
          className="relative inline-flex items-center justify-center px-8 py-2 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={onEditClick}
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></span>
          <span className="relative">EDIT GIG</span>
        </button>
      </div>
    </div>
  )
}

export default GigHeader
