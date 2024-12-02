import React from 'react'

function ProfileHeader() {
  return (
    <div className='flex h-16 items-center justify-center bg-gray-50'>
      <div>
        <h1 className='text-2xl font-bold'>
          Owner <span className='text-red-500'>Dashboard</span>
        </h1>
      </div>
    </div>
  )
}

export default ProfileHeader
