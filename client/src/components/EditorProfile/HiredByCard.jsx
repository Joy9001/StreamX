import React from 'react'
import { useSelector } from 'react-redux'
import { Building2 } from 'lucide-react'

function HiredByCard() {
  const { userData } = useSelector((state) => state.user)
  const hiredByList = userData?.hiredBy || []

  return (
    <div className='flex-1 rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          Hired By
        </h3>
        <span className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'>
          {hiredByList.length} Companies
        </span>
      </div>

      {hiredByList.length === 0 ? (
        <div className='flex flex-col items-center justify-center space-y-2 py-8 text-gray-500'>
          <Building2 className='h-12 w-12' />
          <p>Not hired by any company yet</p>
        </div>
      ) : (
        <ul className='space-y-4'>
          {hiredByList.map((company, index) => (
            <li
              key={company.id || index}
              className='flex items-center justify-between border-b pb-2'>
              <div className='flex items-center gap-4'>
                <span className='min-w-[30px] text-gray-500'>{index + 1}.</span>
                <div>
                  <span className='font-medium text-gray-800'>{company.name}</span>
                  <p className='text-sm text-gray-500'>{company.role}</p>
                </div>
              </div>
              <span className='text-sm text-gray-500'>{company.since}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default HiredByCard
