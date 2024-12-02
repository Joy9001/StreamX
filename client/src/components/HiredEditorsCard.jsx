import React from 'react'
import hiredEditors from '../data/hiredEditors.json'

function HiredEditorsCard() {
  return (
    <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          Hired Editors
        </h3>
      </div>
      <div className='no-scrollbar max-h-[300px] space-y-4 overflow-y-auto'>
        {hiredEditors.editors.map((editor, index) => (
          <div key={editor.id}>
            <div className='flex items-center gap-4 py-2'>
              <img
                src={editor.avatar}
                alt={editor.name}
                className='h-10 w-10 rounded-full object-cover'
              />
              <div>
                <h4 className='font-medium text-gray-800'>{editor.name}</h4>
              </div>
            </div>
            {index < hiredEditors.editors.length - 1 && (
              <div className='border-b border-gray-300'></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HiredEditorsCard
