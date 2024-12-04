import { useSelector } from 'react-redux'
import Navbar from '../NavBar/Navbar.jsx'
import ProfileHeader from './ProfileHeader.jsx'
import UiProfile from './UiProfile.jsx'

function Profile() {
  const navOpen = useSelector((state) => state.ui.navbarOpen)

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
