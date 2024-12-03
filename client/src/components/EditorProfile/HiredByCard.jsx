import React from 'react'
import { User } from 'lucide-react'

function HiredByCard({ hiredByList }) {
  return (
    <div className="flex-1 rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">Hired By</h3>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          {hiredByList?.length || 0} Clients
        </span>
      </div>

      <div className="space-y-4">
        {hiredByList && hiredByList.length > 0 ? (
          hiredByList.map((client, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
            >
              {client.profilePicture ? (
                <img
                  src={client.profilePicture}
                  alt={client.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div>
                <h4 className="font-medium text-gray-900">{client.name}</h4>
                <p className="text-sm text-gray-500">{client.projectCount} projects</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No clients yet</p>
        )}
      </div>
    </div>
  )
}

export default HiredByCard
