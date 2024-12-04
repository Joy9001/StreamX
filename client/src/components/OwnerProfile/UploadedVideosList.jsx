import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

function UploadedVideosList() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const userData = useSelector((state) => state.user.userData)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/videos/all/${userData.user_metadata.role}/${userData._id}`
        )
        setVideos(response.data.videos)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch videos')
      } finally {
        setLoading(false)
      }
    }

    if (userData?._id) {
      fetchVideos()
    }
  }, [userData])

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

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  }

  if (loading) {
    return (
      <div className='h-full rounded-lg bg-white p-6'>
        <div className='flex items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-pink-300 border-t-transparent'></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='h-full rounded-lg bg-white p-6'>
        <p className='text-center text-red-500'>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className='h-full rounded-lg bg-white p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          List Of Videos
        </h3>
      </div>
      {videos.length === 0 ? (
        <p className='text-center text-gray-500'>No videos uploaded yet.</p>
      ) : (
        <ul className='space-y-4'>
          {videos.map((video, index) => (
            console.log('video', video),
            <li
              key={video._id || index}
              className='flex items-center justify-between border-b pb-2'>
              <div className='flex items-center gap-4'>
                <span className='min-w-[30px] text-gray-500'>{index + 1}.</span>
                <div className='flex flex-col'>
                  <span className='font-medium text-gray-800'>{video.metaData.name}</span>
                  {video.editor && (
                    <span className='text-sm text-gray-500'>
                      Editor: {video.editor}
                    </span>
                  )}
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <span
                  className={`rounded-full border px-3 py-1 text-sm font-medium ${getStatusStyle(
                    video.ytUploadStatus
                  )}`}>
                  {video.ytUploadStatus}
                </span>
                <div className='flex items-center gap-1'>
                  <span className='font-medium text-gray-600'>Upload Time:</span>
                  <span className='text-gray-500'>
                    {formatDate(video.uploadTime || video.createdAt)}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <span className='font-medium text-gray-600'>File Size:</span>
                  <span className='text-gray-500'>
                    {formatFileSize(video.metaData.size)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UploadedVideosList