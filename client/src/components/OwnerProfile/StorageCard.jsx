import React from 'react'
import profileData from '../../data/profileData.json'

function StorageCard() {
  const totalStorage = 10240 // 10GB in MB
  const videos = profileData.profiles[0].uploadedVideos

  // Calculate total used storage from video file sizes
  const usedStorage = videos.reduce((total, video) => {
    const sizeInMB = parseInt(video.fileSize.replace('MB', ''))
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
          <p className='font-medium'>Total Storage: 10 GB</p>
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
          Explore Plans
        </button>
      </div>
    </div>
  )
}

export default StorageCard
