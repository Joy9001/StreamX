import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'

function StorageCard() {
  const dialogRef = useRef(null)
  const { userData } = useSelector((state) => state.user);
  const totalStorage = userData?.storage?.total || 10240; // 10GB in MB if not specified
  const usedStorage = userData?.storage?.used || 0;
  const remainingStorage = totalStorage - usedStorage;
  const usagePercentage = (usedStorage / totalStorage) * 100;

  return (
    <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          Storage
        </h3>
      </div>

      <div className='space-y-4'>
        <div className='text-gray-700'>
          <p className='font-medium'>Total Storage: {(totalStorage / 1024).toFixed(2)} GB</p>
        </div>

        <div>
          <div className='mb-1 flex justify-between'>
            <span className='text-gray-700'>
              Data Used: {(usedStorage / 1024).toFixed(2)} GB
            </span>
            <span className='text-gray-500'>{usagePercentage.toFixed(1)}%</span>
          </div>
          <div className='h-2.5 w-full rounded-full bg-gray-200'>
            <div
              className='h-full rounded-full bg-gradient-to-r from-pink-300 to-pink-500 transition-all duration-300'
              style={{ width: `${usagePercentage}%` }}></div>
          </div>
        </div>

        <div className='text-gray-700'>
          <p className='font-medium'>
            Remaining: {(remainingStorage / 1024).toFixed(2)} GB
          </p>
        </div>

        <button 
          onClick={() => dialogRef.current?.showModal()}
          className='btn mt-4 w-full border-none bg-pink-200 text-gray-700 hover:bg-pink-300'
        >
          Upgrade Storage
        </button>
      </div>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box w-11/12 max-w-4xl">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
          </form>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upgrade Storage</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Bronze Plan */}
            <div className="flex flex-col justify-between rounded-lg border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Bronze</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">Free</p>
                <p className="mt-1 text-sm text-gray-500">10GB Storage</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="mr-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Basic video editing
                  </li>
                </ul>
              </div>
              <button className="mt-6 w-full rounded-md bg-gray-500 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-600">
                Current Plan
              </button>
            </div>

            {/* Silver Plan */}
            <div className="flex flex-col justify-between rounded-lg border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Silver</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">₹3,000</p>
                <p className="mt-1 text-sm text-gray-500">100GB Storage</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="mr-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Advanced video editing
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="mr-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Priority support
                  </li>
                </ul>
              </div>
              <button className="mt-6 w-full rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600">
                Upgrade Now
              </button>
            </div>

            {/* Gold Plan */}
            <div className="flex flex-col justify-between rounded-lg border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Gold</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">₹5,000</p>
                <p className="mt-1 text-sm text-gray-500">500GB Storage</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="mr-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Professional video editing
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="mr-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    24/7 support
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="mr-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Advanced analytics
                  </li>
                </ul>
              </div>
              <button className="mt-6 w-full rounded-md bg-yellow-500 px-4 py-2 font-medium text-white transition-colors hover:bg-yellow-600">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}

export default StorageCard
