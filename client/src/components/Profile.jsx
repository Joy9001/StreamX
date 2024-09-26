import ProfileHeader from './ProfileHeader.jsx'
import UserProfile from './UserProfile.jsx'
import HiredEditors from './HiredEditors.jsx'
import Radial from './Radial.jsx'
import RecentCard from './RecentCard.jsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import Navbar from './Navbar.jsx'
import { useRecoilValue } from 'recoil'
import { navbarOpenState } from '../states/navbarState.js'

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
          <Navbar />
        </div>
        <div className='profileContainer'>
          {/* Header */}
          <div className='profileHeader'>
            <ProfileHeader />
          </div>

          {/* Body */}
          <div className='profileBody flex flex-col bg-gray-50 h-screen gap-y-4'>
            <div className='profileInfo flex my-8 justify-evenly h-[20rem]'>
              <UserProfile />
              <HiredEditors />
              <Radial />
            </div>
            <div className='relative'>
              <button
                onClick={() => scroll('left')}
                className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10'>
                <ChevronLeft size={12} />
              </button>
              <div
                ref={scrollContainerRef}
                className='storage-recent-body no-scrollbar m-2 flex overflow-x-scroll border-2 border-blue-300 rounded-md pt-4 px-4 shadow-xl'>
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
                className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10'>
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
