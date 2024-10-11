// import { loginState } from '@/states/loginState.js'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
// import { useNavigate, useSearchParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { drawerState } from '../../states/drawerState.js'
import { navbarOpenState } from '../../states/navbarState.js'
import { allVidState, recentVidState } from '../../states/videoState.js'
import Navbar from '../Navbar.jsx'
import ContentTable from './ContentTable.jsx'
import RecentCard from './RecentCard.jsx'
import StorageNav from './StorageNav.jsx'
import VideoDrawer from './VideoDrawer.jsx'

function Storage() {
  const drawer = useRecoilValue(drawerState)
  const navOpen = useRecoilValue(navbarOpenState)
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [recentVideos, setRecentVideos] = useRecoilState(recentVidState)
  const setAllVideos = useRecoilState(allVidState)[1]
  // const navigate = useNavigate()
  // const setLoginState = useRecoilState(loginState)[1]

  // const [searchParams] = useSearchParams()
  // const login = searchParams.get('login')

  // useEffect(() => {
  //   if (login !== 'true') {
  //     setLoginState(false)
  //     navigate('/')
  //   } else {
  //     console.log('User logged in')
  //     setLoginState(true)
  //   }
  // }, [login, navigate, setLoginState])

  function handleNewBtnClick() {
    fileInputRef.current.click()
  }

  async function handleFileUpload(e) {
    setUploading(true)
    const file = e.target.files[0]

    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await axios.post(
          'http://localhost:3000/api/videos/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        )

        console.log(res)
        setUploading(false)
        setRecentVideos((prev) => [res.data.savedVideo, ...prev])
        setAllVideos((prev) => [res.data.savedVideo, ...prev])
        alert(res.data.message)
      } catch (error) {
        console.error('Error uploading file:', error)
        alert('File upload failed!')
      } finally {
        e.target.value = ''
      }
    }
  }

  // Fetch recent videos
  useEffect(() => {
    async function fetchRecentVideos() {
      try {
        const res = await axios.get('http://localhost:3000/api/videos/recent', {
          withCredentials: true,
        })
        console.log(res.data)
        setRecentVideos(res.data.videos)
      } catch (error) {
        console.error('Error fetching recent videos:', error)
      }
    }

    fetchRecentVideos()
  }, [setRecentVideos])

  return (
    <div className='storage-main flex h-screen'>
      <div
        className={`navbar h-full transition-all duration-300 ${
          navOpen ? 'w-[15%]' : 'w-[5%]'
        } pl-0`}>
        <Navbar title='Storage' />
      </div>

      {/* Main */}
      <div className={`storage-container flex flex-grow`}>
        <div
          className={`storage-main flex-grow p-2 transition-all duration-300 ${
            drawer ? 'mr-4' : 'mr-0'
          }`}>
          {/* Inside Nav */}
          <StorageNav />

          {/* Main Content */}
          <div className='storage-main-content'>
            <div className='storage-recent-content my-2'>
              <div className='storage-recent-header mx-2 flex justify-between'>
                <div className='flex'>
                  <span className='flex items-center text-lg font-semibold'>
                    Recent
                  </span>
                </div>
                <div className='storage-new-btn'>
                  <button
                    className={`btn ${uploading ? 'btn-disabled' : 'btn-secondary'}`}
                    onClick={handleNewBtnClick}>
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
                            stroke='#000000'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'></path>{' '}
                        </g>
                      </svg>
                    )}

                    {uploading ? 'Uploading...' : 'New'}
                  </button>
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

              <div className='storage-recent-body no-scrollbar m-2 flex w-full overflow-x-scroll'>
                {recentVideos.map((video) => (
                  <RecentCard key={video._id} video={video} />
                ))}
              </div>
            </div>
            <div className='storage-content mt-2'>
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
            className={`storage-drawer no-scrollbar w-[18%] overflow-scroll`}>
            <VideoDrawer />
          </div>
        )}
      </div>
    </div>
  )
}

export default Storage
