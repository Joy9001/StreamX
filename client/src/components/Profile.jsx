import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { navbarOpenState } from '../states/navbarState.js'
import HiredEditors from './HiredEditors.jsx'
import Navbar from './Navbar.jsx'
import ProfileHeader from './ProfileHeader.jsx'
import Radial from './Radial.jsx'
import RecentCard from './Storage/RecentCard.jsx'
import UserProfile from './UserProfile.jsx'

function Profile() {
  const scrollContainerRef = useRef(null)
  const navOpen = useRecoilValue(navbarOpenState)

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300 // Adjust this value as needed
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }
  return (
    <>
      <div className='profile-main flex h-screen'>
        <div
          className={`navbar h-full transition-all duration-300 ${
            navOpen ? 'w-[15%]' : 'w-[5%]'
          } pl-0`}>
          <Navbar title='Profile' />
        </div>
        <div className='profileContainer'>
          {/* Header */}
          <div className='profileHeader'>
            <ProfileHeader />
          </div>

          {/* Body */}
          <div className='profileBody flex h-screen flex-col gap-y-4 bg-gray-50'>
            <div className='profileInfo my-8 flex h-[20rem] justify-evenly'>
              <UserProfile />
              <HiredEditors />
              <Radial />
            </div>
            <div className='relative'>
              <button
                onClick={() => scroll('left')}
                className='absolute left-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-md'>
                <ChevronLeft size={12} />
              </button>
              <div
                ref={scrollContainerRef}
                className='storage-recent-body no-scrollbar m-2 flex overflow-x-scroll rounded-md border-2 border-blue-300 px-4 pt-4 shadow-xl'>
                <RecentCard />
                <RecentCard />
                <RecentCard />
                <RecentCard />
                <RecentCard />
                <RecentCard />
                <RecentCard />
              </div>
              <button
                onClick={() => scroll('right')}
                className='absolute right-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-md'>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
