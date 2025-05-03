import axios from 'axios'
import { FileVideo, HardDrive } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function EditorVideosList() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { userData } = useSelector((state) => state.user)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        console.log('Fetching videos for editor:', userData?._id)

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/videos/all/${userData.user_metadata.role}/${userData?._id}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        )

        console.log('Videos data:', response.data.videos)
        setVideos(response.data.videos)
        setError(null)
      } catch (err) {
        console.error('Error fetching videos:', err)
        setError('Failed to load videos')
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

  if (loading) {
    return (
      <div className='h-full rounded-lg bg-white p-6'>
        <div className='mb-6'>
          <div className='h-8 w-48 animate-pulse rounded bg-gray-200'></div>
        </div>
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='flex animate-pulse items-center justify-between border-b pb-2'>
              <div className='h-6 w-1/3 rounded bg-gray-200'></div>
              <div className='h-6 w-24 rounded bg-gray-200'></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='h-full rounded-lg bg-white p-6'>
        <p className='text-center text-red-500'>{error}</p>
      </div>
    )
  }

  return (
    <div className='h-full rounded-lg bg-white p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          My Videos
        </h3>
        <span className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'>
          {videos.length} Videos
        </span>
      </div>
      {videos.length === 0 ? (
        <p className='text-center text-gray-500'>No videos found</p>
      ) : (
        <ul className='space-y-4'>
          {videos.map((video, index) => (
            <li
              key={video._id}
              className='flex items-center justify-between border-b pb-2'>
              <div className='flex items-center gap-4'>
                <span className='min-w-[30px] text-gray-500'>{index + 1}.</span>
                <div>
                  <span className='font-medium text-gray-800'>
                    {video.metaData?.name || 'Untitled'}
                  </span>
                  <div className='mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500'>
                    {video.owner && <p>Owner: {video.owner || 'Unknown'}</p>}
                    <div className='flex items-center gap-1'>
                      <HardDrive className='h-4 w-4' />
                      {video.metaData?.size
                        ? `${(video.metaData.size / (1024 * 1024)).toFixed(2)} MB`
                        : 'Unknown size'}
                    </div>
                    <div className='flex items-center gap-1'>
                      <FileVideo className='h-4 w-4' />
                      {video.metaData?.contentType || 'video/mp4'}
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <span
                  className={`rounded-full border px-3 py-1 text-sm font-medium ${getStatusStyle(video.ytUploadStatus)}`}>
                  {video.ytUploadStatus || 'None'}
                </span>
                <span className='text-sm text-gray-500'>
                  {formatDate(video.createdAt)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default EditorVideosList
