import logoImage from '@/assets/logoX.png'
import { setNavbarOpen } from '@/store/slices/uiSlice'
import { useAuth0 } from '@auth0/auth0-react'
import {
  Briefcase,
  ChevronLeft,
  CircleDollarSign,
  Settings,
  User,
  Video,
} from 'lucide-react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Navbar({ title }) {
  const open = useSelector((state) => state.ui.navbarOpen)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0()
  const userData = useSelector((state) => state.user.userData)

  const Menus = [
    { title: 'Storage', icon: Video, route: '/storage' },
    { title: 'Request & Approve', icon: Settings, route: '/req-n-approve' },
    { title: 'Wallet', icon: CircleDollarSign, route: '/payments' },
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
        open ? 'w-64' : 'w-20'
      } relative flex h-screen flex-shrink-0 flex-col justify-between bg-gradient-to-b from-gray-50 via-gray-50 to-pink-50 p-4 pt-6 shadow-lg transition-all duration-300`}>
      <div className='flex w-full flex-col items-center justify-center'>
        {/* Arrow toggle button */}
        <button
          onClick={() => dispatch(setNavbarOpen(!open))}
          aria-label={open ? 'Close sidebar' : 'Open sidebar'}
          className='absolute -right-3 top-9 flex h-7 w-7 items-center justify-center rounded-full border-2 border-pink-100 bg-white text-gray-600 shadow-lg transition-all duration-300 hover:border-pink-200 hover:text-pink-500'>
          <ChevronLeft
            className={`h-5 w-5 transform transition-transform duration-300 ${!open && 'rotate-180'}`}
          />
        </button>

        {/* Logo and title */}
        <div
          className={`flex items-center ${open ? 'mr-12 gap-x-3' : 'justify-center'}`}>
          <div className='group relative h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-pink-500 to-purple-500 p-1 transition-all duration-300 hover:shadow-lg'>
            <img
              src={logoImage}
              alt='StreamX Logo'
              className='h-full w-full rounded-full bg-white object-cover transition-transform duration-300 group-hover:scale-110'
            />
          </div>
          {open && (
            <h1 className='origin-left text-xl font-bold tracking-wide transition-all duration-300'>
              Stream
              <span className='bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                X
              </span>
            </h1>
          )}
        </div>

        {/* Menu Items */}
        <ul
          className={`mt-8 flex w-full flex-col items-center justify-center gap-2`}>
          {Menus.map((menu, index) => (
            <li
              key={index}
              onClick={() => navigate(`${menu.route}`)}
              role='menuitem'
              aria-current={title === menu.title ? 'page' : undefined}
              className={`group flex w-full cursor-pointer items-center ${open ? 'justify-start' : 'justify-center'} rounded-xl p-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-white hover:text-pink-600 hover:shadow-md ${
                title === menu.title ? 'bg-white text-pink-600 shadow-md' : ''
              }`}>
              <menu.icon className='h-5 w-5 transition-transform duration-300 group-hover:scale-110' />
              {open && (
                <span className='ml-3 origin-left duration-200'>
                  {menu.title}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* User profile section */}
      {open ? (
        <div className='mt-auto flex flex-col rounded-xl bg-white/50 p-3 backdrop-blur-sm'>
          <div className='mb-1 flex items-center gap-x-3'>
            {isLoading ? (
              <div className='h-10 w-10 animate-pulse rounded-full bg-gray-200'></div>
            ) : (
              <div className='group relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-pink-100 transition-all duration-300 hover:ring-pink-300'>
                <img
                  src={user?.picture || '/assets/default-avatar.png'}
                  alt={user?.name || 'User avatar'}
                  className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
                />
              </div>
            )}
            {!isLoading && (
              <div className='flex-1 overflow-hidden'>
                <p className='truncate text-sm font-medium'>
                  {user?.name || 'User'}
                </p>
                <p className='truncate text-xs text-gray-500'>
                  {user?.email || ''}
                </p>
              </div>
            )}
          </div>
          {!isLoading && (
            <div className='flex justify-end'>
              {isAuthenticated ? (
                <button
                  onClick={() =>
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    })
                  }
                  className='rounded px-2 py-1 text-xs text-red-500 hover:text-red-700'>
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => loginWithRedirect()}
                  className='rounded px-2 py-1 text-xs text-blue-500 hover:text-blue-700'>
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className='mt-auto flex items-center justify-center rounded-xl bg-white/50 backdrop-blur-sm'>
          {isLoading ? (
            <div className='h-10 w-10 animate-pulse rounded-full bg-gray-200'></div>
          ) : (
            <div className='group relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-pink-100 transition-all duration-300 hover:ring-pink-300'>
              <img
                src={user?.picture || '/assets/default-avatar.png'}
                alt={user?.name || 'User avatar'}
                className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

Navbar.propTypes = {
  title: PropTypes.string,
}

export default Navbar
