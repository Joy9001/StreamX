import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { navbarOpenState } from '../../states/navbarState.js'
import HiredEditors from '../HiredEditors.jsx'
import Navbar from '../Navbar.jsx'
import ProfileHeader from './ProfileHeader.jsx'
import Radial from '../Radial.jsx'
import RecentCard from '../Storage/RecentCard.jsx'

import { Paper, Box, Typography, Button } from '@mui/material'
import UiProfile from './UiProfile.jsx'

function Profile() {
  const scrollContainerRef = useRef(null)
  const navOpen = useRecoilValue(navbarOpenState)

  // Dummy video data
  const dummyVideos = [
    { title: 'Project Showcase 2024' },
    { title: 'Client Presentation' },
    { title: 'Product Demo' },
    { title: 'Tutorial Series' },
  ]

  // Dummy hired editors data
  const hiredEditors = [
    { name: 'Alice Johnson', role: 'Video Editor' },
    { name: 'Bob Smith', role: 'Motion Graphics' },
    { name: 'Carol White', role: 'Sound Editor' },
  ]

  return (
    <div className='flex h-screen overflow-hidden'>
      <div
        className={`navbar h-full transition-all duration-300 ${
          navOpen ? 'w-[15%]' : 'w-[5%]'
        } pl-0`}>
        <Navbar title='Profile' />
      </div>
      <div className='flex w-full flex-1 flex-grow flex-col overflow-hidden'>
        <ProfileHeader />
        <UiProfile />
      </div>
    </div>
  )
}

export default Profile
