import React from 'react';
import hiredEditors from '../data/hiredEditors.json';

function HiredEditorsCard() {
  return (
    <div className="w-[300px] bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-transparent">
          Hired Editors
        </h3>
      </div>
      <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
        {hiredEditors.editors.map((editor, index) => (
          <div key={editor.id}>
            <div className="flex items-center gap-4 py-2">
              <img
                src={editor.avatar}
                alt={editor.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium text-gray-800">{editor.name}</h4>
              </div>
            </div>
            {index < hiredEditors.editors.length - 1 && (
              <div className="border-b border-gray-300"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HiredEditorsCard;
