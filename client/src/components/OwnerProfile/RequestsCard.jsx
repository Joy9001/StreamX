import React from 'react'
import requestsData from '../../data/requestsData.json'

function RequestsCard() {
  const { requests } = requestsData

  return (
    <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          Requests
        </h3>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between rounded-lg bg-gray-50 p-2'>
          <span className='text-gray-600'>Total Requests</span>
          <span className='text-xl font-semibold text-gray-800'>
            {requests.totalRequests}
          </span>
        </div>

        <div className='flex items-center justify-between rounded-lg bg-green-50 p-2'>
          <span className='text-gray-600'>Approved</span>
          <span className='text-xl font-semibold text-green-600'>
            {requests.approvedRequests}
          </span>
        </div>

        <div className='flex items-center justify-between rounded-lg bg-red-50 p-2'>
          <span className='text-gray-600'>Rejected</span>
          <span className='text-xl font-semibold text-red-600'>
            {requests.rejectedRequests}
          </span>
        </div>

        <div className='flex items-center justify-between rounded-lg bg-yellow-50 p-2'>
          <span className='text-gray-600'>Pending</span>
          <span className='text-xl font-semibold text-yellow-600'>
            {requests.pendingRequests}
          </span>
        </div>
      </div>
    </div>
  )
}

export default RequestsCard
