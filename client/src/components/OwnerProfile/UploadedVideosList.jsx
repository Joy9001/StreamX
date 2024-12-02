import React from 'react'

function UploadedVideosList({ videos }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Uploaded':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Uploading':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Pending':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className='h-full rounded-lg bg-white p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          List Of Videos
        </h3>
      </div>
      <ul className='space-y-4'>
        {videos?.map((video, index) => (
          <li
            key={index}
            className='flex items-center justify-between border-b pb-2'>
            <div className='flex items-center gap-4'>
              <span className='min-w-[30px] text-gray-500'>{index + 1}.</span>
              <span className='font-medium text-gray-800'>{video.title}</span>
            </div>
            <div className='flex items-center gap-4'>
              <span
                className={`rounded-full border px-3 py-1 text-sm font-medium ${getStatusStyle(video.ytUploadStatus)}`}>
                {video.ytUploadStatus}
              </span>
              <div className='flex items-center gap-1'>
                <span className='font-medium text-gray-600'>Upload Time:</span>
                <span className='text-gray-500'>
                  {formatDate(video.uploadTime)}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='font-medium text-gray-600'>File Size:</span>
                <span className='text-gray-500'>{video.fileSize || 'N/A'}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UploadedVideosList
