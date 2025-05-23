// import { loginState } from '@/states/loginState.js'
import { Button } from '@/components/ui/button.jsx'
import { setAllVideos, setRecentVideos } from '@/store/slices/videoSlice.js'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../NavBar/Navbar.jsx'
import ContentTable from './ContentTable.jsx'
import RecentCard from './RecentCard.jsx'
import StorageNav from './StorageNav.jsx'
import VideoDrawer from './VideoDrawer.jsx'

function Storage() {
  const drawer = useSelector((state) => state.ui.drawerOpen)
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const recentVideos = useSelector((state) => state.video.recentVideos)
  const allVideos = useSelector((state) => state.video.allVideos)
  const userData = useSelector((state) => state.user.userData)
  const { getAccessTokenSilently } = useAuth0()
  const [accessToken, setAccessToken] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const token = await getAccessTokenSilently()
        setAccessToken(token)
      } catch (error) {
        console.error('Error fetching access token:', error)
      }
    }
    fetchAccessToken()
  }, [getAccessTokenSilently])

  function handleNewBtnClick() {
    fileInputRef.current.click()
  }

  async function handleFileUpload(e) {
    setUploading(true)
    const file = e.target.files[0]

    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('role', userData.user_metadata.role)
      formData.append('userId', userData._id)
      console.log('formData', formData)
      console.log('accessToken in handleFileUpload', accessToken)
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/videos/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        )

        console.log('res.data', res.data)

        dispatch(setRecentVideos([res.data.videoData, ...recentVideos]))
        dispatch(setAllVideos([res.data.videoData, ...allVideos]))
        alert(res.data.message)
      } catch (error) {
        console.error('Error uploading file:', error)
        alert('File upload failed!')
      } finally {
        e.target.value = ''
        setUploading(false)
      }
    }
  }

  // Fetch recent videos
  useEffect(() => {
    async function fetchRecentVideos() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/videos/recent/${userData.user_metadata.role}/${userData._id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        )
        console.log('recent videos', res.data)
        dispatch(setRecentVideos(res.data.videos))
      } catch (error) {
        console.error('Error fetching recent videos:', error)
      }
    }

    if (JSON.stringify(userData) !== '{}') fetchRecentVideos()
  }, [dispatch, accessToken, userData])

  return (
    <div className='storage-main flex h-screen'>
      <div className='navbar-container h-full flex-shrink-0'>
        <Navbar title='Storage' />
      </div>

      {/* Main */}
      <div className='storage-container flex flex-grow overflow-hidden pl-6'>
        <div
          className={`storage-main flex h-full flex-grow flex-col transition-all duration-300 ${
            drawer ? 'mr-4' : 'mr-0'
          }`}>
          {/* Inside Nav */}
          <div className='flex-shrink-0 p-4 pb-2'>
            <StorageNav />
          </div>

          {/* Main Content */}
          <div className='storage-main-content flex-1 overflow-y-auto p-4 pt-2'>
            <div className='storage-recent-content mb-4'>
              <div className='storage-recent-header mx-2 flex justify-between'>
                <div className='flex'>
                  <span className='flex items-center text-lg font-semibold'>
                    Recent
                  </span>
                </div>
                <div className='storage-new-btn'>
                  <Button
                    variant='default'
                    disabled={uploading}
                    onClick={handleNewBtnClick}
                    className='flex items-center gap-2'>
                    {uploading ? (
                      <span className='loading loading-spinner loading-sm'></span>
                    ) : (
                      <svg
                        className='h-6 w-6'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                        <g
                          id='SVGRepo_tracerCarrier'
                          strokeLinecap='round'
                          strokeLinejoin='round'></g>
                        <g id='SVGRepo_iconCarrier'>
                          {' '}
                          <path
                            d='M6 12H18M12 6V18'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'></path>{' '}
                        </g>
                      </svg>
                    )}
                    {uploading ? 'Uploading...' : 'New'}
                  </Button>
                  <input
                    type='file'
                    accept='video/*'
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className='hidden'
                    disabled={uploading}
                  />
                </div>
              </div>

              <div className='storage-recent-body no-scrollbar m-2 flex w-full overflow-x-auto'>
                <div className='flex flex-wrap gap-4'>
                  {recentVideos.map((video) => (
                    <RecentCard key={video._id} video={video} />
                  ))}
                </div>
              </div>
            </div>
            <div className='storage-content mt-6'>
              <div className='storge-content-header m-2'>
                <span className='text-xl font-semibold'>My Videos</span>
              </div>
              <div className='storage-content-body'>
                <ContentTable />
              </div>
            </div>
          </div>
        </div>

        {/* Drawer */}
        {drawer && (
          <div
            className={`storage-drawer h-full w-[18%] flex-shrink-0 overflow-hidden`}>
            <VideoDrawer />
          </div>
        )}
      </div>
    </div>
  )
}

export default Storage
