import { setNavbarOpen } from '@/store/slices/uiSlice'
import { useAuth0 } from '@auth0/auth0-react'
import { Briefcase, ChevronLeft, Settings, User, Video } from 'lucide-react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NavLogin from './NavLogin'
import NavProfile from './NavProfile'

function Navbar({ title }) {
  const open = useSelector((state) => state.ui.navbarOpen)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0()
  const userData = useSelector((state) => state.user.userData)

  const Menus = [
    { title: 'Storage', icon: Video, route: '/storage' },
    // { title: 'Profile', icon: User, route: '/profile/owner' },
    // { title: 'Editor Profile', icon: User, route: '/profile/editor' },
    // { title: 'Hire Editors', icon: Briefcase, route: '/hire-editors' },
    { title: 'Request & Approve', icon: Settings, route: '/req-n-approve' },
  ]

  if (userData?.user_metadata?.role === 'Owner') {
    Menus.push({ title: 'Profile', icon: User, route: '/profile/owner' })
    Menus.push({
      title: 'Hire Editors',
      icon: Briefcase,
      route: '/hire-editors',
    })
  } else if (userData?.user_metadata?.role === 'Editor') {
    Menus.push({
      title: 'Profile',
      icon: User,
      route: '/profile/editor',
    })
  }

  return (
    <div
      className={`${
        open ? 'w-full' : 'w-20'
      } relative flex h-screen flex-shrink-0 flex-col justify-between bg-gradient-to-b from-gray-50 via-gray-50 to-pink-50 p-5 pt-6 shadow-lg transition-all duration-300`}>
      <div className='flex w-full flex-col items-center justify-center'>
        {/* Arrow toggle button */}
        <button
          onClick={() => dispatch(setNavbarOpen(!open))}
          className='absolute -right-3 top-9 flex h-7 w-7 items-center justify-center rounded-full border-2 border-pink-100 bg-white text-gray-600 shadow-lg transition-all duration-300 hover:border-pink-200 hover:text-pink-500'>
          <ChevronLeft
            className={`h-5 w-5 transform transition-transform duration-300 ${!open && 'rotate-180'}`}
          />
        </button>

        {/* Logo and title */}
        <div className={`flex items-center gap-x-4 ${open && 'mr-16'}`}>
          <div className='group relative h-14 w-14 overflow-hidden rounded-full bg-gradient-to-br from-pink-500 to-purple-500 p-1 transition-all duration-300 hover:shadow-lg'>
            <img
              src='http://localhost:5173/src/assets/logoX.png'
              alt='Logo'
              className='h-full w-full rounded-full bg-white object-cover transition-transform duration-300 group-hover:scale-110'
            />
          </div>
          {open && (
            <h1
              className={`origin-left text-2xl font-bold tracking-wide transition-all duration-300 ${!open && 'scale-0'}`}>
              Stream
              <span className='bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                X
              </span>
            </h1>
          )}
        </div>

        {/* Menu Items */}
        <ul
          className={`mt-8 flex w-full flex-col items-center justify-center gap-2 *:w-full ${open ? '*:justify-left' : '*:justify-center'}`}>
          {Menus.map((menu, index) => (
            <li
              key={index}
              onClick={() => navigate(`${menu.route}`)}
              className={`group flex cursor-pointer items-center gap-x-4 rounded-xl p-3 text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-white hover:text-pink-600 hover:shadow-md ${
                title === menu.title ? 'bg-white text-pink-600 shadow-md' : ''
              }`}>
              <menu.icon className='h-5 w-5 transition-transform duration-300 group-hover:scale-110' />
              <span className={`${!open && 'hidden'} origin-left duration-200`}>
                {menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* User profile section */}
      <div
        className={`mt-auto flex items-center gap-x-4 rounded-xl bg-white/50 p-4 backdrop-blur-sm ${open ? 'justify-between' : 'justify-center'}`}>
        <div className='group relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-pink-100 transition-all duration-300 hover:ring-pink-300'>
          <img
            src={
              user?.picture ||
              'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
            }
            alt='User'
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
          />
        </div>
        {open &&
          (isAuthenticated ? (
            <NavProfile logout={logout} user={user} />
          ) : (
            <NavLogin loginWithRedirect={loginWithRedirect} />
          ))}
      </div>
    </div>
  )
}

Navbar.propTypes = {
  title: PropTypes.string,
}

export default Navbar
