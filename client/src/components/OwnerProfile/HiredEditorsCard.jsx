import React from 'react'
import hiredEditors from '../../data/hiredEditors.json'

function HiredEditorsCard() {
  return (
    <div className="flex-1 rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="" />
          <h3 className="bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">Hired Editors</h3>
        </div>
        <div className="mt-2 flex justify-end">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {hiredEditors.editors.length} Editors
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {hiredEditors.editors.map((editor, index) => (
          <div
            key={editor.id}
            className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
          >
            <img
              src={editor.avatar}
              alt={editor.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <h4 className="font-medium text-gray-900">{editor.name}</h4>
              <p className="text-sm text-gray-500">Editor</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HiredEditorsCard
