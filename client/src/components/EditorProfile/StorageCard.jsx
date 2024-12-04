import React from 'react'
import { useSelector } from 'react-redux'

function StorageCard({ editorData }) {
  const totalStorage = editorData?.storageLimit || 10240 // 10GB in MB default
  const videos = editorData?.portfolio || []

  // Calculate total used storage from video file sizes
  const usedStorage = videos.reduce((total, video) => {
    const sizeInMB = typeof video.fileSize === 'string' 
      ? parseInt(video.fileSize.replace('MB', ''))
      : video.fileSize || 0
    return total + sizeInMB
  }, 0)

  const remainingStorage = totalStorage - usedStorage
  const usagePercentage = (usedStorage / totalStorage) * 100

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

        <button className='btn mt-4 w-full border-none bg-pink-200 text-gray-700 hover:bg-pink-300'>
          Upgrade Storage
        </button>
      </div>
    </div>
  )
}

export default StorageCard
