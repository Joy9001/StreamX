import React from 'react'

const membershipStyles = {
  Free: 'bg-white text-gray-700 border border-gray-300',
  Bronze: 'bg-amber-700 text-white',
  Silver: 'bg-gray-400 text-white',
  Gold: 'bg-yellow-500 text-white',
}

function EditorProfileCard({ editor, onEditProfile }) {
  return (
    <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl'>
      <img
        src={editor.profilePicture}
        alt={editor.name}
        className='border-primary-100 mx-auto block h-[100px] w-[100px] rounded-full border-4 object-cover'
      />
      <h2 className='mt-4 text-center text-xl font-bold text-gray-800'>
        {editor.name}
      </h2>
      <div className='mt-2 flex justify-center'>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${membershipStyles[editor.membership]}`}>
          {editor.membership}
        </span>
      </div>
      <p className='mt-4 text-center text-sm text-gray-500'>
        {editor.bio}
      </p>
      <div className='mt-6'>
        <button
          onClick={onEditProfile}
          className='btn w-full border-none bg-pink-200 text-gray-700 hover:bg-pink-300'>
          EDIT PROFILE
        </button>
      </div>
    </div>
  )
}

export default EditorProfileCard