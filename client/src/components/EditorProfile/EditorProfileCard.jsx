import React from 'react'
import { useSelector } from 'react-redux'

const membershipStyles = {
  bronze: 'bg-amber-700 text-white',
  silver: 'bg-gray-400 text-white',
  gold: 'bg-yellow-500 text-white',
}

function EditorProfileCard({ onEditProfile }) {
  const { userData } = useSelector((state) => state.user)

  if (!userData) {
    return (
      <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg'>
        <div className='mb-6'>
          <div className='h-8 w-48 animate-pulse rounded bg-gray-200'></div>
        </div>
        <div className='space-y-4'>
          <div className='h-6 w-full animate-pulse rounded bg-gray-200'></div>
          <div className='h-6 w-2/3 animate-pulse rounded bg-gray-200'></div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          Profile
        </h3>
      </div>

      <div className='space-y-4'>
        <div className='text-center'>
          <div className='avatar mb-4'>
            <div className='w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100'>
              <img
                src='https://imgix.ranker.com/list_img_v2/1360/2681360/original/the-best-ichigo-quotes?auto=format&q=50&fit=crop&fm=pjpg&dpr=2&crop=faces&h=185.86387434554973&w=355'
                alt='profile'
              />
            </div>
          </div>
          <h4 className='text-xl font-bold text-gray-800'>
            {userData?.name || 'Anonymous'}
          </h4>
          <p className='text-gray-500'>{userData?.email}</p>
        </div>

        <div>
          <p className='mb-2 font-medium text-gray-700'>Membership Level</p>
          <div
            className={`rounded-lg ${membershipStyles[userData?.membership || 'bronze']} p-2 text-center`}>
            {userData?.membership?.charAt(0).toUpperCase() +
              userData?.membership?.slice(1) || 'Bronze'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorProfileCard
