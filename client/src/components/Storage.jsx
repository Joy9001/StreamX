import { useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { drawerState } from '../states/drawerState.js'
import { navbarOpenState } from '../states/navbarState.js'
import ContentTable from './ContentTable'
import Navbar from './Navbar.jsx'
import RecentCard from './RecentCard'
import StorageNav from './StorageNav.jsx'
import VideoDrawer from './VideoDrawer'

function Storage() {
  const drawer = useRecoilValue(drawerState)
  const navOpen = useRecoilValue(navbarOpenState)
  const fileInputRef = useRef(null)

  function handleNewBtnClick() {
    fileInputRef.current.click()
  }

  return (
    <div className='storage-main flex h-screen'>
      <div
        className={`navbar h-full transition-all duration-300 ${
          navOpen ? 'w-[15%]' : 'w-[5%]'
        } pl-0`}>
        <Navbar />
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
                    className='btn btn-secondary'
                    onClick={handleNewBtnClick}>
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
                    New
                  </button>
                  <input
                    type='file'
                    accept='video/*'
                    ref={fileInputRef}
                    onChange={(e) => console.log(e.target.files)}
                    className='hidden'
                  />
                </div>
              </div>

              <div className='storage-recent-body no-scrollbar m-2 flex w-full overflow-x-scroll'>
                <RecentCard />
                <RecentCard />
                <RecentCard />
                <RecentCard />
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
